# Requirements

The following contents describe the requirements defined for the contract. Each
requirement will be covered by at least one test.

## Initialization / Construction

[ ] **VC-I-1** It should generate 20.000.000 tokens.
[ ] **VC-I-2** It should set "VC" as the symbol.
[ ] **VC-I-3** It should set "Vision Coin" as the name.
[ ] **VC-I-4** It should set "18" as the number of decimals.
[ ] **VC-I-5** It should fail if the start date of the ICO is lteq the Pre-ICO start date.
[ ] **VC-I-6** It should fail if the end date of the ICO is lteq the ICO.
[ ] **VC-I-7** It should fail if the owner address equals the ico address.
[ ] **VC-I-8** It should fail if the owner address equals the foundervision address.
[ ] **VC-I-9** It should fail if the foundervision address equals the ico address.
[ ] **VC-I-10** It should send 10.000.000 VC to the ico address.
[ ] **VC-I-11** It should send 10.000.000 VC to the foundervision address.
[ ] **VC-I-12** It should change the contract state from NO_STATE to DEPLOYED.  