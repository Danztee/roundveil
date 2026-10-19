# Roundveil demo video

The recorded walkthrough shows an accepted claim, the public/private data boundary, and a rejected claim. It describes the current local prototype accurately: compiled Compact circuits run in the browser, but no zero-knowledge proof or Midnight transaction is generated.

## Narration

Meet Roundveil. Savings circles face a problem: confirming contributions can reveal private financial details. Roundveil keeps the amount with the member and uses compiled Compact circuits to verify a coordinator-issued receipt against the circle’s rule. At fifteen thousand units, the claim passes and the amount clears; only a salted commitment and pseudonymous tag appear. At fourteen thousand nine hundred ninety-nine, the circuit rejects the claim. Six runtime tests cover eligibility, tampering, repeat claims, and ledger contents. This prototype runs compiled Compact circuits locally. It does not yet generate a zero-knowledge proof or submit a Midnight transaction. Next: wallet, proof-server, and Preprod integration, then a real-circle pilot.

## On-screen sequence

1. Show the circle rule and member contribution field.
2. Submit `15000`; show the accepted claim, cleared amount, and salted commitment.
3. Expand **What the ledger sees**.
4. Reset and submit `14999`; show the Compact circuit reject the claim.
