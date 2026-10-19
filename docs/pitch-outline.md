# Roundveil pitch outline

The editable pitch deck is `Roundveil-Pitch.pptx` in this folder.

## Slide 1 — Roundveil

Private contribution eligibility for rotating savings circles.

## Slide 2 — The privacy gap

Circle coordinators need to check contributions before payouts. A shared sheet can reveal every member's amount and payment history. Roundveil separates the eligibility check from those details.

## Slide 3 — Product flow

The coordinator confirms a payment off-chain and issues a salted receipt commitment. The member proves the committed amount meets the circle rule. A blinded, circle-specific tag prevents a second claim.

## Slide 4 — Data boundary

Private: member secret, amount, receipt salt, issuer secret. Public: circle rule, blinded tag, salted commitment, claim marker. The tag is pseudonymous and linkable within one circle.

## Slide 5 — Adoption and next work

Start with organized workplace or trade association circles that already use a coordinator. Pilot the eligibility workflow without taking custody of group funds. Next: wire Midnight.js and Lace, run the circuits against the local proof server, deploy to Preprod, then test with a small group. These are proposed milestones, not completed traction.
