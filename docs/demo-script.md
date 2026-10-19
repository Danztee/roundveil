# 50-second demo video script

**Screen:** Open the local Roundveil dashboard. Keep the `DEMO MODE` marker visible.

**Narration:**

> Roundveil is a private eligibility check for rotating savings circles. Today, a coordinator often has to expose contribution amounts or payment history just to confirm that someone can receive their turn.

**Screen:** Point to the circle rule, then the contribution field. Enter `15000` and click **Check eligibility privately**.

**Narration:**

> Here the circle rule is fifteen thousand units. The member checks against that rule in the browser. The amount clears from the field, and this demo stores only a salted commitment locally. The amount never goes to this dashboard's server.

**Screen:** Show the success state and expand **What the ledger sees**.

**Narration:**

> The Compact contract is designed for the next step: a coordinator-issued commitment can be checked against the private amount, and a circle-specific tag prevents a second claim. The tag remains linkable inside that circle, so the demo calls that out.

**Screen:** Show the footer and demo label.

**Narration:**

> This Wave 2 prototype does not yet connect a wallet, generate a live Midnight proof, or move money. It focuses on one useful privacy boundary for existing savings groups, with the contract and product path ready to extend.
