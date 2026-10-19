# AKINDO submission copy

## Project description

Roundveil explores private eligibility checks for coordinator-led rotating savings circles. After a coordinator confirms a contribution off-chain, they issue a salted receipt commitment. A member can prove that the committed amount meets the circle's public minimum without publishing the amount. The Compact contract uses private witnesses, a salted commitment, and a circle-specific pseudonymous tag to prevent a second claim.

## Wave 2 progress

Built a responsive product prototype, an Apache-2.0 Compact contract, and compiled artifacts for `registerMember`, `issueReceipt`, and `claimTurn` with Compact 0.31.1. Added an in-browser Compact Runtime simulation, six passing runtime tests, a privacy model, setup and evaluation instructions, a pitch deck, and a recorded demo video.

## Current status

The browser runs the compiled `registerMember`, `issueReceipt`, and `claimTurn` Compact circuits through Compact Runtime, with separate member and coordinator private state. It demonstrates eligible and rejected claims without contacting a server. It does not generate a Midnight proof, connect a wallet, send a transaction, or move funds. Coordinator confirmation of the real-world payment remains an explicit trust assumption.
