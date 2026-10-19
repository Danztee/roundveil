# Roundveil

**Private contribution eligibility for rotating savings circles.** Roundveil lets a member prove that a coordinator-issued contribution receipt meets the circle's public rule without publishing the amount or salt.

> **Local contract simulation.** The browser executes the compiled Compact circuits through Compact Runtime. It does not generate a Midnight zero-knowledge proof, connect a wallet, submit a transaction, or move funds. The code separates member and coordinator private state so the flow can be connected to Midnight.js and a local proof server next.

## The problem

In a rotating savings circle, a coordinator needs to confirm that each member has met the contribution rule before a payout. A shared spreadsheet or group chat can expose a person's amount and payment history to everyone in the group. Roundveil separates the check from the underlying financial details.

## What this prototype does

- Executes the compiled `registerMember`, `issueReceipt`, and `claimTurn` circuits in the browser.
- Creates a salted Compact commitment and clears the amount from the field after an accepted claim.
- Uses separate member and coordinator private state in the simulation.
- Uses a circle-specific member tag so the contract can reject a second claim. The tag is pseudonymous, but actions under it are linkable within that circle.
- Explains which data is private and which data is public.

The sample figures and member activity in the interface are illustrative. No user research, pilot, adoption, or deployed contract is claimed.

## Privacy model

| Stays with the member or coordinator | Public ledger data |
| --- | --- |
| Member secret, contribution amount, and receipt salt | Minimum contribution rule |
| Coordinator's issuer secret | Blinded member tag for a receipt |
| Local receipt details needed to make a later proof | Salted receipt commitment and whether the tag claimed |

The coordinator confirms the off-chain payment before issuing a receipt. The contract verifies that an issued receipt matches the member's private amount and that the amount meets the rule. This prototype does **not** prove that a bank transfer happened; it keeps the coordinator as the receipt issuer. The tag prevents repeat claims but makes one member's actions linkable inside a circle.

## Run the demo

Requires Node.js 22 or newer.

```sh
npm run dev
```

Run `npm ci`, then `npm run dev` and open <http://127.0.0.1:4173>. Enter `15000` and choose **Check eligibility privately**. The app executes the compiled Compact registration, receipt issuance, and claim circuits with fresh local secrets. The ledger receives only a salted commitment, the amount clears from the field, and the panel says no network transaction was sent. Choose **Reset simulation**, enter `14999`, and see the Compact claim circuit reject it.

## Compile the Compact contract

Install the Compact toolchain from the [official Midnight instructions](https://docs.midnight.network/getting-started/installation), then pin compiler `0.31.1`:

```sh
compact update 0.31.1
npm run compile:compact
```

The checked-in generated files are in `contracts/managed/roundveil/`. Compiler `0.31.1` compiles `registerMember`, `issueReceipt`, and `claimTurn`. The contract stores the public threshold and issuer commitment, a pseudonymous member tag, a salted contribution commitment, and a one-claim marker. The member amount and receipt salt remain private circuit inputs. One deployment represents one circle payout round; receipt refresh and cycle rollover are future work.

Run the Compact Runtime simulation cases with `npm test`. Build the production frontend bundle with `npm run build`.

## Manual evaluation

1. Start the demo and check that the circle rule is `15,000 units`.
2. Enter `15000`; the UI runs all three compiled circuits, shows the commitment, and clears the amount.
3. Use **Reset simulation**, enter `14999`, and confirm the claim circuit rejects it below the rule.
4. Expand **What the ledger sees** and confirm the public tag limitation is described.
5. Run `npm run compile:compact`; the compiler should report three circuits and exit successfully.

## Architecture and current limits

- `index.html`, `src/main.js`, `src/contract-simulation.js`, `src/styles.css`: responsive dashboard with an in-browser Compact Runtime simulation.
- `contracts/roundveil.compact`: coordinator receipt and member claim circuits.
- `vite.config.js`: configures WebAssembly loading and deduplicates Midnight Runtime modules for browser execution.
- Vite serves the UI and bundles the Compact Runtime for browser execution.
- `docs/demo-script.md`: short judge walkthrough and honest status language.
- `docs/pitch-outline.md`: editable slide copy source.

Not implemented: Midnight.js transaction providers, a Lace wallet connection, a local proof server, Preprod deployment, payment custody or payout transfer, multi-cycle rollover, and a recoverable encrypted credential vault. The in-browser simulation executes Compact logic but does not prove or submit a real transaction.

## Submission checklist

- [x] Compact source and generated circuits included; compiler 0.31.1 compiled all three circuits.
- [x] Setup and architecture README.
- [x] Slide deck, recorded demo video, and narration included in the submission package.
- [x] Published the [public GitHub repository](https://github.com/Danztee/roundveil) with the `midnightntwrk` topic.
- [ ] Connect the app to the deployed contract before claiming end-to-end chain functionality.

## License

Apache-2.0. See [LICENSE](LICENSE).
