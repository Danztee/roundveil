# Roundveil

**Private contribution eligibility for rotating savings circles.** Roundveil lets a member prove that a coordinator-issued contribution receipt meets the circle's public rule without publishing the amount or salt.

> **Wave 2 prototype.** The browser demo makes a salted SHA-256 commitment locally. It does not generate a Midnight zero-knowledge proof, connect a wallet, send a transaction, or move funds. The included Compact contract is the intended verification path; the README states exactly where the demo ends.

## The problem

In a rotating savings circle, a coordinator needs to confirm that each member has met the contribution rule before a payout. A shared spreadsheet or group chat can expose a person's amount and payment history to everyone in the group. Roundveil separates the check from the underlying financial details.

## What this prototype does

- Gives a member an interactive, local-only eligibility preview.
- Creates a salted commitment in the browser and clears the amount from the field after a successful preview.
- Includes a Compact contract that lets a coordinator issue a receipt commitment and lets a member prove the receipt meets a public minimum.
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

Requires Node.js 22 or newer. No npm dependencies are needed.

```sh
npm run dev
```

Open <http://127.0.0.1:4173>. Enter `15000` and choose **Check eligibility privately**. The amount is checked in the browser, committed with a fresh random salt, saved in local storage, and cleared from the input. The success panel says no network call was made. Try `14999` to see the rule fail. **Reset demo** removes the saved preview.

## Compile the Compact contract

Install the Compact toolchain from the [official Midnight instructions](https://docs.midnight.network/getting-started/installation), then pin compiler `0.31.1`:

```sh
compact update 0.31.1
npm run compile:compact
```

The checked-in generated files are in `contracts/managed/roundveil/`. Compiler `0.31.1` compiled both `issueReceipt` and `claimTurn` circuits successfully. The contract keeps the threshold and issuer commitment public, stores only a salted contribution commitment, checks the private amount against the minimum, and records a circle-specific claim tag. One deployment represents one circle payout round; receipt refresh and cycle rollover are future work.

## Manual evaluation

1. Start the demo and check that the circle rule is `15,000 units`.
2. Preview `15000`; the field clears, a commitment appears, and the UI says no network request was made.
3. Use **Reset demo**, enter `14999`, and confirm the rule rejects it without storing a receipt.
4. Expand **What the ledger sees** and confirm the public tag limitation is described.
5. Run `npm run compile:compact`; the compiler should report two circuits and exit successfully.

## Architecture and current limits

- `index.html`, `src/main.js`, `src/styles.css`: responsive dashboard and client-only product preview.
- `contracts/roundveil.compact`: coordinator receipt and member claim circuits.
- `server.mjs`: dependency-free local static server.
- `docs/demo-script.md`: short judge walkthrough and honest status language.
- `docs/pitch-outline.md`: editable slide copy source.

Not implemented in this Wave 2 prototype: Midnight.js bindings, a Lace wallet connection, a live proof server, preprod deployment, payment custody or payout transfer, multi-cycle rollover, and a recoverable encrypted credential vault. The browser demo is not a substitute for those features.

## Submission checklist

- [x] Compact source and generated circuits included; compiler 0.31.1 compiled both circuits.
- [x] Setup and architecture README.
- [x] Slide deck and a demo-video script included in the submission package.
- [ ] Publish a public GitHub repository and add the `midnightntwrk` topic.
- [ ] Record and upload the demo video.
- [ ] Connect the app to the deployed contract before claiming end-to-end chain functionality.

## License

Apache-2.0. See [LICENSE](LICENSE).
