import * as RT from '@midnight-ntwrk/compact-runtime';
import { Contract, ledger } from '../contracts/managed/roundveil/contract/index.js';

const ZERO_COIN_PUBLIC_KEY = '0'.repeat(64);
const MINIMUM_CONTRIBUTION = 15_000n;

function randomBytes() {
  return crypto.getRandomValues(new Uint8Array(32));
}

function toHex(bytes) {
  return [...bytes].map((value) => value.toString(16).padStart(2, '0')).join('');
}

function createContract(privateState) {
  return new Contract({
    issuerSecret: ({ privateState: state }) => [state, state.issuerSecret],
    memberSecret: ({ privateState: state }) => [state, state.memberSecret],
    receiptSalt: ({ privateState: state }) => [state, state.receiptSalt],
  });
}

export function createCircleSimulation({
  minimumContribution = MINIMUM_CONTRIBUTION,
  configuredIssuerSecret = randomBytes(),
  coordinatorIssuerSecret = configuredIssuerSecret,
  memberSecret = randomBytes(),
  receiptSalt = randomBytes(),
} = {}) {
  let memberPrivateState = { memberSecret, receiptSalt };
  let coordinatorPrivateState = { issuerSecret: coordinatorIssuerSecret, receiptSalt };
  const memberContract = createContract(memberPrivateState);
  const coordinatorContract = createContract(coordinatorPrivateState);
  const address = RT.sampleContractAddress();
  let memberTag;

  const issuerSecretHash = RT.persistentHash(
    new RT.CompactTypeBytes(32),
    configuredIssuerSecret,
  );
  const initialState = coordinatorContract.initialState(
    RT.createConstructorContext(coordinatorPrivateState, ZERO_COIN_PUBLIC_KEY),
    minimumContribution,
    issuerSecretHash,
  );
  let contractState = initialState.currentContractState;

  function run(contract, privateState, circuit, ...args) {
    const context = RT.createCircuitContext(address, ZERO_COIN_PUBLIC_KEY, contractState, privateState);
    const result = contract.impureCircuits[circuit](context, ...args);
    contractState = result.context.currentQueryContext.state;
    return result;
  }

  function getLedger() {
    return ledger(contractState);
  }

  return {
    registerMember() {
      const result = run(memberContract, memberPrivateState, 'registerMember');
      memberPrivateState = result.context.currentPrivateState;
      memberTag = result.result;
      return { memberTag: toHex(memberTag) };
    },

    issueReceipt(amount) {
      if (!memberTag) throw new Error('Register the member before issuing a receipt.');
      const result = run(coordinatorContract, coordinatorPrivateState, 'issueReceipt', memberTag, amount);
      coordinatorPrivateState = result.context.currentPrivateState;
      const commitment = getLedger().contributionCommitments.lookup(memberTag);
      return { commitment: toHex(commitment) };
    },

    claimTurn(amount) {
      if (!memberTag) throw new Error('Register the member before claiming a turn.');
      const result = run(memberContract, memberPrivateState, 'claimTurn', amount);
      memberPrivateState = result.context.currentPrivateState;
      const currentLedger = getLedger();
      return {
        memberTag: toHex(memberTag),
        commitment: toHex(currentLedger.contributionCommitments.lookup(memberTag)),
        registered: currentLedger.registeredMemberTags.member(memberTag),
        claimed: currentLedger.claimedMemberTags.member(memberTag),
        minimumContribution: currentLedger.minimumContribution,
      };
    },

    ledger: getLedger,
  };
}

export function simulateContribution(amount) {
  const simulation = createCircleSimulation();
  simulation.registerMember();
  const receipt = simulation.issueReceipt(BigInt(amount));
  const claim = simulation.claimTurn(BigInt(amount));
  return { ...receipt, ...claim };
}
