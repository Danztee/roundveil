# AKINDO submission copy

## Project description

Roundveil explores private eligibility checks for coordinator-led rotating savings circles. After a coordinator confirms a contribution off-chain, they issue a salted receipt commitment. A member can prove that the committed amount meets the circle's public minimum without publishing the amount. The Compact contract uses private witnesses, a salted commitment, and a circle-specific pseudonymous tag to prevent a second claim.

## Wave 2 progress

Built a responsive product demo, an Apache-2.0 Compact contract, and compiled proving and verification artifacts for the `issueReceipt` and `claimTurn` circuits with Compact 0.31.1. Added a privacy model, setup and evaluation instructions, pitch deck, and recording script.

## Current status

The browser preview checks the threshold and creates a salted SHA-256 commitment locally. It does not generate a Midnight proof, connect a wallet, send a transaction, or move funds. The Compact contract is compiled but not deployed. Coordinator confirmation of the real-world payment remains an explicit trust assumption.
