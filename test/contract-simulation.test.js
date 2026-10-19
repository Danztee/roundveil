import assert from 'node:assert/strict';
import test from 'node:test';
import { createCircleSimulation } from '../src/contract-simulation.js';

test('registers a pseudonymous member, issues a commitment, and accepts an eligible claim', () => {
  const simulation = createCircleSimulation();
  const { memberTag } = simulation.registerMember();

  assert.equal(simulation.ledger().registeredMemberTags.member(Buffer.from(memberTag, 'hex')), true);
  const { commitment } = simulation.issueReceipt(15_000n);
  assert.match(commitment, /^[0-9a-f]{64}$/);

  const claim = simulation.claimTurn(15_000n);
  assert.equal(claim.registered, true);
  assert.equal(claim.claimed, true);
  assert.equal(simulation.ledger().claimedMemberTags.member(Buffer.from(memberTag, 'hex')), true);
});

test('rejects a claim below the public minimum', () => {
  const simulation = createCircleSimulation();
  simulation.registerMember();
  simulation.issueReceipt(14_999n);

  assert.throws(() => simulation.claimTurn(14_999n), /Contribution is below the circle rule/);
  assert.equal(simulation.ledger().claimedMemberTags.size(), 0n);
});

test('rejects a claim whose amount does not open the issued receipt', () => {
  const simulation = createCircleSimulation();
  simulation.registerMember();
  simulation.issueReceipt(15_000n);

  assert.throws(() => simulation.claimTurn(15_001n), /Amount does not match the private receipt/);
});

test('rejects receipt issuance by a coordinator with the wrong secret', () => {
  const configuredIssuerSecret = new Uint8Array(32).fill(1);
  const wrongIssuerSecret = new Uint8Array(32).fill(2);
  const simulation = createCircleSimulation({ configuredIssuerSecret, coordinatorIssuerSecret: wrongIssuerSecret });
  simulation.registerMember();

  assert.throws(() => simulation.issueReceipt(15_000n), /Coordinator authorization required/);
});

test('rejects a repeated receipt and a second claim', () => {
  const simulation = createCircleSimulation();
  simulation.registerMember();
  simulation.issueReceipt(15_000n);
  assert.throws(() => simulation.issueReceipt(15_000n), /Receipt already issued/);

  simulation.claimTurn(15_000n);
  assert.throws(() => simulation.claimTurn(15_000n), /This member already claimed/);
});

test('does not store the amount as a public ledger field', () => {
  const amount = 15_000n;
  const simulation = createCircleSimulation();
  simulation.registerMember();
  simulation.issueReceipt(amount);
  const publicLedger = simulation.ledger();

  assert.equal('amount' in publicLedger, false);
  assert.equal('receiptSalt' in publicLedger, false);
  assert.equal(publicLedger.contributionCommitments.size(), 1n);
});
