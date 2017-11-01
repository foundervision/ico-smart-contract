# Vision Coin Token Smart Contract

This project contains the code for the smart contract of the VisionCoin (VC) token including the Initial Coin Offering (ICO) functionality.

## Introduction

`By taking part in the Foundervision ICO, you comply with the rules set up in the smart contract.`

That sounds reasonable, but it's easier said than done, because only a small fraction of potential ICO participants are able to read Smart Contracts. 

While the rules of the VisionCoin ICO are already lined out in the Whitepaper, this resource will present you a more comprehensive description of the inner workings of the ICO Smart Contract. 

Transparency is a key value at Foundervision and to build up trust we opened our ICO Smart Contract functionality for everyone else to see. Be assured that this is the beginning of a future standard for all of our work with the Blockchain: nothing will be hidden or obfuscated. It can't work otherwise. Transparency is the key.

In the following documentation we will use `VC` when we reference to the tokens (`V`ision`C`oin) and `SC` when we reference a Smart Contract (`S`mart `C`ontract).

All the contracts functionality is tested and the test cases can be seen at the end of this document and, if you are interested in the testing sources, in the `/test` folder.

### Deployment key facts

At the time the `SC` is deployed to the network it will generate 200.000.000 Tokens with the name `VisionCoin`, the Symbol `VC` and a maximum of `18` decimals (reflecting `ether`'s smallest unit – `wei`). 

200.000.000 is the fixed supply, there will never be more `VC` in circulation.

After the `VC`s are created, the total supply will be split in half.

 - `100.000.000 VC` will go to a special ICO wallet which will be used to serve `VC` during the ICO.
 - `100.000.000 VC` will go to a wallet owned by Foundervision. These 100.000.000 `VC`s will be splitted into different wallets again to deversify and lower the risk of being hacked as a whole, but that's not part of the `SC`.

During deployment, the `SC` will setup a date range in which the Pre-ICO and the ICO will take place. It does not necessarily mean that the token sale will start or end at exactly these dates. It's just a boundary that will limit the ICO duration.

A defined amount of the 100.000.000 ICO `VC`s will be handed out as a present to people that show interest in the Coin via http://www.foundervision.com and register themselves together with their wallet address. This special offer will be available until the end of the ICO. Each registration on the homepage will lead to a 10 `VC` present until the 250.000 `VC` pot is empty. 

The Pre-ICO is restricted to a maximum supply of `50.000.000 VC`. If this supply is exceeded with a transaction while the Pre-ICO is running, the transaction will be rejected.

### Vision Coins

The VisionCoin implements the ERC20 Token Standard officially published by ethereum and described here: https://theethereum.wiki/w/index.php/ERC20_Token_Standard

To adhere with the ERC20 specification, we are deriving our `SC` from the audited Open-Zeppelin Standard Token implementation: https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/contracts/token/StandardToken.sol

### Exchange rate

We defined a fixed exchange ratio of 1000/1, which means that with each `Ether` that you send to the ICO you'll get (at least, see bonus system) 1000 `VC` back. This ratio will not change throughout the ICO, independent of the Ether value.

### Minimum transaction

In the Pre-ICO phase, the minimum transaction is of variable Ether, you can see the minimum rates at http://www.foundervision.com 

In the ICO Phase a minimum of 0,01 Ether (10 `VC`) is set. Transaction below these limits will be rejected.

### Stages

The `SC` holds a variable to identify the stage of the contract. This stage can be one of the following values:

- **NONE** Initial stage, development.
- **DEPLOYED** The contract was deployed to the blockchain.
- **PRE_ICO_RUNNING** The Pre-ICO is running.
- **PRE_ICO_PAUSED** The Pre-ICO is paused.
- **PRE_ICO_FINISHED** The Pre-ICO is finished.
- **ICO_RUNNING** The ICO is running.
- **ICO_PAUSED** The ICO is paused.
- **ICO_FINISHED** The ICO is finished.
- **ACTIVE** The Pre-ICO and the ICO are finished. The Vision Coin is active, no ICO possible anymore.

The ICO is split into two main stages. 

In the Pre-ICO stage you'll get an `additional 20 %` on top, but to participate in the Pre-ICO, a minimum deposit of `XX Ether` is required. 

In the ICO phase there is a lower limit of 0,01 Ether to participate and the bonus table is the same as in the Pre-ICO phase. The bonus table applies to both phases.

The 2 phases are identified through the contracts stage, namely `PRE_ICO_RUNNING` and `ICO_RUNNING`.

### Bonus system

The ICO is working with a bonus system. So depending on the amount of ether you will send to the contract, you will get additional `VC`. Here is the bonus table:

| Min Ether    | Bonus Percent | Bonus VC Outcome  |
| ------------ | ------------- | ----------------- |
| +1.000 ether | 10.00 %       | +100.000,00 VC    |
| +750 ether   | 9.00 %        | +60.750,00 VC     |
| +500 ether   | 8.00 %        | +40.000,00 VC     |
| +250 ether   | 7.00 %        | +10.750,00 VC     |
| +100 ether   | 6.00 %        | +6000,00 VC       |
| +75 ether    | 5.00 %        | +3750,00 VC       |
| +50 ether    | 4.00 %        | +2000,00 VC       |
| +25 ether    | 3.00 %        | +750,00 VC        |
| +20 ether    | 2.75 %        | +550,00 VC        |
| +10 ether    | 2.50 %        | +250,00 VC        |
| +5 ether     | 2.00 %        | +100,00 VC        |
| +4 ether     | 1.50 %        | +60,00 VC         |
| +3 ether     | 1.00 %        | +30,00 VC         |
| +2 ether     | 0.75 %        | +15,00 VC         |
| +1 ether     | 0.50 %        | +5,00 VC          |
| less         | 0.00 %        | +0 VC             |

### Stage Control

As said before, the `SC` holds a stage. It can switch between different stages. The stage changes can only be executed by the `SC` owner, which is Foundervision, but there are also some other rules that must apply for a successful stage change.

The following list shows the allowed stage transitions.

| From | To   |
| ---- | ---- |
| NONE | DEPLOYED |
| DEPLOYED | PRE_ICO_RUNNING |
| PRE_ICO_RUNNING | PRE_ICO_PAUSED |
| PRE_ICO_PAUSED | PRE_ICO_RUNNING |
| PRE_ICO_PAUSED | PRE_ICO_FINISHED |
| PRE_ICO_RUNNING | PRE_ICO_FINISHED |
| PRE_ICO_FINISHED | ICO_RUNNING |
| ICO_RUNNING | ICO_PAUSED |
| ICO_PAUSED | ICO_RUNNING |
| ICO_PAUSED | ICO_FINISHED |
| ICO_RUNNING | ICO_FINISHED |
| ICO_FINISHED | ACTIVE |

There are more underlying rules for the transitions, but this table shows 
the possible flow control at a whole.

#### Starting the Pre-ICO

The function that switches to the stage `PRE_ICO_RUNNING` and starts the Pre-ICO phase is called `startPreICO()`.

The following rules must apply for a successful stage change:

 - The current stage is `DEPLOYED`.
 - The caller of the function is the owner of the contract.
 - The current timestamp is greater than or equal the start date of the Pre-ICO.
 - The current timestamp is lower than the end date of the ICO. 

The last two parts are important. The start and end-date from the deployment are just an additional security measurement. 

Just because the Pre-ICO start date is set, it does not necessarily mean, that the Pre-ICO starts at that date. The owner of the contract has to call the startPreICO()` method to actually change the stage and start the Pre-ICO phase.

This can become handy if there are problems with the contract itself and the start of the Pre-ICO has to be delayed.

#### Pausing the Pre-ICO

The function that switches to the stage `PRE_ICO_PAUSED` and pauses the Pre-ICO phase is called `pausePreICO()`.

The following rules must apply for a successful stage change:

 - The current stage is `PRE_ICO_RUNNING`.
 - The caller of the function is the owner of the contract.

This can become handy if there are problems with the contract itself and we want to protect investors.

#### Resume the Pre-ICO

The function that switches to the stage `PRE_ICO_RUNNING` and resumes the previously paused Pre-ICO is called `resumePreICO()`.

The following rules must apply for a successful stage change:

 - The current stage is `PRE_ICO_PAUSED`.
 - The caller of the function is the owner of the contract.

#### Finish the Pre-ICO

The function that finishes the Pre-ICO is called `finishPreICO()`.

The following rules must apply for a successful stage change:

 - The current stage is `PRE_ICO_RUNNING` OR `PRE_ICO_PAUSED`.
 - The caller of the function is the owner of the contract.
 
#### Start the ICO

The function that starts the ICO is called `startICO()`.

The following rules must apply for a successful stage change:

 - The current stage is `PRE_ICO_FINISHED`.
 - The caller of the function is the owner of the contract.

#### Pausing the ICO

The function that switches to the stage `ICO_PAUSED` and pauses the ICO phase is called `pauseICO()`.

The following rules must apply for a successful stage change:

 - The current stage is `ICO_RUNNING`.
 - The caller of the function is the owner of the contract.

#### Resume the ICO

The function that switches to the stage `ICO_RUNNING` and resumes the previously paused ICO is called `resumeICO()`.

The following rules must apply for a successful stage change:

 - The current stage is `ICO_PAUSED`.
 - The caller of the function is the owner of the contract.

#### Finish the ICO

The function that finishes the ICO is called `finishICO()`.

The following rules must apply for a successful stage change:

 - The current stage is `ICO_RUNNING` OR `ICO_PAUSED`.
 - The caller of the function is the owner of the contract.
 
#### Set Active

The function that sets the contracts stage to ACTIVE is called `setActive()`.

The following rules must apply for a successful stage change:

 - The current stage is `ICO_FINISHED`.
 - The caller of the function is the owner of the contract.

### Gifts

There is a function that is used to gift a given address with 10 VC from the ICO wallet. 

The following rules must apply for a successful gift:

 - The caller of the function is the owner of the contract.
 - The amount of giftable VCs is greater or equal 10 (initial 250.000).
 - The address was not gifted before.

### Test results

```
truffle(docker)> test test/A-InitializationTest.js
Using network 'docker'.



  Contract: VC-A Initialization
    ✓ VC-A-1 should generate 200.000.000 tokens (381ms)
    ✓ VC-A-2 should set "VC" as the symbol (491ms)
    ✓ VC-A-3 should set "VisionCoin" as the name (490ms)
    ✓ VC-A-4 should set "18" as the number of decimals (781ms)
    ✓ VC-A-5 should fail if the end date of the ICO is lteq the Pre-ICO (1534ms)
    ✓ VC-A-6 should fail if the owner address equals the ico address. (386ms)
    ✓ VC-A-7 should fail if the owner address equals the foundervision address. (444ms)
    ✓ VC-A-8 should fail if the foundervision address equals the ico address. (365ms)
    ✓ VC-A-9 should send 100.000.000 VC the ico address. (418ms)
    ✓ VC-A-10 should send 100.000.000 VC the foundervision address. (375ms)
    ✓ VC-A-11 should change the contract stage from NONE to DEPLOYED. (379ms)
    ✓ VC-A-12 should set the owner correctly. (371ms)
    ✓ VC-A-13 should set the giftable VC amount correctly. (419ms)
    ✓ VC-A-14 should set the pre-ico cap correctly. (453ms)
    ✓ VC-A-15 should init the ico start date correctly. (482ms)
    ✓ VC-A-16 should init the ico end date correctly. (385ms)
    ✓ VC-A-17 should init the ico address correctly. (397ms)
    ✓ VC-A-18 should init the foundervision address correctly. (412ms)
    ✓ VC-A-19 should set the min pre ico enter amount correctly. (421ms)


  19 passing (9s)

truffle(docker)> test test/B-StartPreICOTest.js
Using network 'docker'.



  Contract: VC-B Start Pre-ICO
    ✓ VC-B-1 should be able to start the Pre-ICO if all conditions match. (618ms)
    ✓ VC-B-2 should fail if the caller is not the contract owner. (381ms)
    ✓ VC-B-3 it should fail if the current stage is not `DEPLOYED`. (599ms)
    ✓ VC-B-4 should fail if the current date is earlier than the initial Pre-ICO start date. (840ms)
    ✓ VC-B-5 should fail if the current date is greater than or equals the end date. (382ms)


  5 passing (3s)

truffle(docker)> test test/C-PausePreICOTest.js
Using network 'docker'.



  Contract: VC-C Pause Pre-ICO
    ✓ VC-C-1 should be able to pause the Pre-ICO. (756ms)
    ✓ VC-C-2 should fail if the caller is not the contract owner. (922ms)
    ✓ VC-C-3 should fail if the current stage is not `PRE_ICO_RUNNING`. (692ms)


  3 passing (2s)

truffle(docker)> test test/D-ResumePreICOTest.js
Using network 'docker'.



  Contract: V-D Resume paused Pre-ICO
    ✓ VC-D-1 should be able to resume the previously paused Pre-ICO. (703ms)
    ✓ VC-D-2 should fail if the caller is not the contract owner. (704ms)
    ✓ VC-D-3 should fail if the current stage is not `PRE_ICO_PAUSED` (356ms)


  3 passing (2s)

truffle(docker)> test test/E-FinishPreICOTest.js
Using network 'docker'.



  Contract: VC-E Finish running or paused Pre-ICO
    ✓ VC-E-1 should be able to finish the previously paused Pre-ICO. (700ms)
    ✓ VC-E-2 should be able to finish the running Pre-ICO. (657ms)
    ✓ VC-E-3 should fail if the caller is not the contract owner. (739ms)
    ✓ VC-E-4 should fail if the current stage is not `PRE_ICO_PAUSED` and not `PRE_ICO_RUNNING` (360ms)


  4 passing (2s)

truffle(docker)> test test/F-StartICOTest.js
Using network 'docker'.



  Contract: VC-F Start the ICO
    ✓ VC-F-1 should be able to start ICO if all conditions match. (647ms)
    ✓ VC-F-2 should fail if the caller is not the contract owner. (628ms)
    ✓ VC-F-3 should fail if the current stage is not `PRE_ICO_FINISHED` (477ms)


  3 passing (2s)

truffle(docker)> test test/G-PauseICOTest.js
Using network 'docker'.



(node:8) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 unhandledRejection listeners added. Use emitter.setMaxListeners() to increase limit
  Contract: VC-G Pause running ICO
    ✓ VC-G-1 should be able to pause the ICO. (702ms)
    ✓ VC-G-2 should fail if the caller is not the contract owner. (621ms)
    ✓ VC-C-3 should fail if the current stage is not `ICO_RUNNING`. (402ms)


  3 passing (2s)

truffle(docker)> test test/H-ResumeICOTest.js
Using network 'docker'.



  Contract: VC-H Resume a paused ICO
    ✓ VC-H-1 should be able to resume the previously paused ICO. (978ms)
    ✓ VC-H-2 should fail if the caller is not the contract owner. (927ms)
    ✓ VC-H-3 should fail if the current stage is not `ICO_PAUSED` (627ms)


  3 passing (3s)

truffle(docker)> test test/I-FinishICOTest.js
Using network 'docker'.



  Contract: VC-I Finish a running or paused ICO
    ✓ VC-I-1 should be able to finish the previously paused ICO. (772ms)
    ✓ VC-I-2 should be able to finish the running ICO. (730ms)
    ✓ VC-I-3 should fail if the caller is not the contract owner. (679ms)
    ✓ VC-I-4 should fail if the current stage is not `ICO_RUNNING` and not `ICO_PAUSED` (431ms)


  4 passing (3s)

truffle(docker)> test test/J-SetActiveTest.js
Using network 'docker'.



  Contract: VC-J Set contract status to active.
    ✓ VC-J-1 should be able to set a finished ICO to ACTIVE. (817ms)
    ✓ VC-J-2 should fail if the caller is not the contract owner. (642ms)
    ✓ VC-J-3 should fail if the current stage is not `ICO_FINISHED` (385ms)


  3 passing (2s)

truffle(docker)> test test/K-Transactions.js
Using network 'docker'.



  Contract: VC-K Transactions
    ✓ VC-K-1 should deny sending funds if the stage is not `PRE_ICO_RUNNING` or `ICO_RUNNING`. (577ms)
    ✓ VC-K-2 should allow sending funds if the stage is `PRE_ICO_RUNNING` or `ICO_RUNNING`. (1498ms)
    ✓ VC-K-3 should deny sending ether if the stage is `PRE_ICO_RUNNING` and the funds are below "minPreIcoAmount" ether. (806ms)
    ✓ VC-K-4 should allow funds if the stage is `PRE_ICO_RUNNING` and the funds are gteq "minPreIcoAmount" ether. (1370ms)
    ✓ VC-K-5 should deduct the given ether from the sender. (984ms)
    ✓ VC-K-6 should send the given ether to the ico wallet. (1047ms)
    ✓ VC-K-7 should credit VC to the sender. (943ms)
    ✓ VC-K-8 should deduct VC from the ico wallet. (1267ms)
    ✓ VC-K-9 should deny sending zero transactions. (815ms)
    ✓ VC-K-10 It should deny sending funds if the status is `PRE_ICO_RUNNING` but the pre-ico cap is reached. (1646ms)
    ✓ VC-K-11 should deny sending ether if the stage is `ICO_RUNNING` and the funds are below 0.01 ether. (688ms)
    ✓ VC-K-12 should fail if there are no funds left (3093ms)


  12 passing (15s)

truffle(docker)> 


truffle(docker)> test test test/L-IcoCalculationTest.js
Using network 'docker'.



  Contract: VC-L Calculation based on precalculated result-sets.
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 990 VC from the ICO wallet when 0.99 ether are sent. (790ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 990 VC to the sender when 0.99 ether are sent. (840ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 0.99 Ether from the senders wallet when 990 VC are sent. (941ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 0.99 Ether to the ICO wallet when 990 VC are sent. (1051ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 1005 VC from the ICO wallet when 1 ether are sent. (774ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 1005 VC to the sender when 1 ether are sent. (827ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 1 Ether from the senders wallet when 1005 VC are sent. (886ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 1 Ether to the ICO wallet when 1005 VC are sent. (1140ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 2015 VC from the ICO wallet when 2 ether are sent. (1084ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 2015 VC to the sender when 2 ether are sent. (1200ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 2 Ether from the senders wallet when 2015 VC are sent. (1207ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 2 Ether to the ICO wallet when 2015 VC are sent. (1107ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 3012.425 VC from the ICO wallet when 2.99 ether are sent. (1152ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 3012.425 VC to the sender when 2.99 ether are sent. (810ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 2.99 Ether from the senders wallet when 3012.425 VC are sent. (871ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 2.99 Ether to the ICO wallet when 3012.425 VC are sent. (819ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 3030 VC from the ICO wallet when 3 ether are sent. (770ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 3030 VC to the sender when 3 ether are sent. (730ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 3 Ether from the senders wallet when 3030 VC are sent. (898ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 3 Ether to the ICO wallet when 3030 VC are sent. (882ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 4029.9 VC from the ICO wallet when 3.99 ether are sent. (730ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 4029.9 VC to the sender when 3.99 ether are sent. (969ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 3.99 Ether from the senders wallet when 4029.9 VC are sent. (865ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 3.99 Ether to the ICO wallet when 4029.9 VC are sent. (859ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 4060 VC from the ICO wallet when 4 ether are sent. (808ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 4060 VC to the sender when 4 ether are sent. (770ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 4 Ether from the senders wallet when 4060 VC are sent. (871ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 4 Ether to the ICO wallet when 4060 VC are sent. (816ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 5064.85 VC from the ICO wallet when 4.99 ether are sent. (722ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 5064.85 VC to the sender when 4.99 ether are sent. (756ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 4.99 Ether from the senders wallet when 5064.85 VC are sent. (792ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 4.99 Ether to the ICO wallet when 5064.85 VC are sent. (884ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 5100 VC from the ICO wallet when 5 ether are sent. (748ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 5100 VC to the sender when 5 ether are sent. (714ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 5 Ether from the senders wallet when 5100 VC are sent. (843ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 5 Ether to the ICO wallet when 5100 VC are sent. (848ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 6109.8 VC from the ICO wallet when 5.99 ether are sent. (954ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 6109.8 VC to the sender when 5.99 ether are sent. (1119ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 5.99 Ether from the senders wallet when 6109.8 VC are sent. (1096ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 5.99 Ether to the ICO wallet when 6109.8 VC are sent. (1182ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 10250 VC from the ICO wallet when 10 ether are sent. (1252ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 10250 VC to the sender when 10 ether are sent. (948ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 10 Ether from the senders wallet when 10250 VC are sent. (1056ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 10 Ether to the ICO wallet when 10250 VC are sent. (1092ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 20489.75 VC from the ICO wallet when 19.99 ether are sent. (935ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 20489.75 VC to the sender when 19.99 ether are sent. (897ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 19.99 Ether from the senders wallet when 20489.75 VC are sent. (1005ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 19.99 Ether to the ICO wallet when 20489.75 VC are sent. (1040ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 20550 VC from the ICO wallet when 20 ether are sent. (858ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 20550 VC to the sender when 20 ether are sent. (817ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 20 Ether from the senders wallet when 20550 VC are sent. (943ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 20 Ether to the ICO wallet when 20550 VC are sent. (1257ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 25677.225 VC from the ICO wallet when 24.99 ether are sent. (831ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 25677.225 VC to the sender when 24.99 ether are sent. (843ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 24.99 Ether from the senders wallet when 25677.225 VC are sent. (949ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 24.99 Ether to the ICO wallet when 25677.225 VC are sent. (992ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 25750 VC from the ICO wallet when 25 ether are sent. (834ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 25750 VC to the sender when 25 ether are sent. (779ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 25 Ether from the senders wallet when 25750 VC are sent. (929ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 25 Ether to the ICO wallet when 25750 VC are sent. (950ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 51489.7 VC from the ICO wallet when 49.99 ether are sent. (756ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 51489.7 VC to the sender when 49.99 ether are sent. (762ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 49.99 Ether from the senders wallet when 51489.7 VC are sent. (900ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 49.99 Ether to the ICO wallet when 51489.7 VC are sent. (902ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 52000 VC from the ICO wallet when 50 ether are sent. (777ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 52000 VC to the sender when 50 ether are sent. (780ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 50 Ether from the senders wallet when 52000 VC are sent. (933ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 50 Ether to the ICO wallet when 52000 VC are sent. (891ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 77989.6 VC from the ICO wallet when 74.99 ether are sent. (761ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 77989.6 VC to the sender when 74.99 ether are sent. (752ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 74.99 Ether from the senders wallet when 77989.6 VC are sent. (874ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 74.99 Ether to the ICO wallet when 77989.6 VC are sent. (1069ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 78750 VC from the ICO wallet when 75 ether are sent. (735ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 78750 VC to the sender when 75 ether are sent. (782ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 75 Ether from the senders wallet when 78750 VC are sent. (888ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 75 Ether to the ICO wallet when 78750 VC are sent. (826ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 104989.5 VC from the ICO wallet when 99.99 ether are sent. (808ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 104989.5 VC to the sender when 99.99 ether are sent. (724ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 99.99 Ether from the senders wallet when 104989.5 VC are sent. (909ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 99.99 Ether to the ICO wallet when 104989.5 VC are sent. (1041ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 106000 VC from the ICO wallet when 100 ether are sent. (914ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 106000 VC to the sender when 100 ether are sent. (825ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 100 Ether from the senders wallet when 106000 VC are sent. (848ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 100 Ether to the ICO wallet when 106000 VC are sent. (900ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 264989.4 VC from the ICO wallet when 249.99 ether are sent. (765ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 264989.4 VC to the sender when 249.99 ether are sent. (1171ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 249.99 Ether from the senders wallet when 264989.4 VC are sent. (1341ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 249.99 Ether to the ICO wallet when 264989.4 VC are sent. (938ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 267500 VC from the ICO wallet when 250 ether are sent. (796ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 267500 VC to the sender when 250 ether are sent. (866ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 250 Ether from the senders wallet when 267500 VC are sent. (882ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 250 Ether to the ICO wallet when 267500 VC are sent. (914ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 534989.3 VC from the ICO wallet when 499.99 ether are sent. (824ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 534989.3 VC to the sender when 499.99 ether are sent. (832ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 499.99 Ether from the senders wallet when 534989.3 VC are sent. (934ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 499.99 Ether to the ICO wallet when 534989.3 VC are sent. (864ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 540000 VC from the ICO wallet when 500 ether are sent. (789ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 540000 VC to the sender when 500 ether are sent. (827ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 500 Ether from the senders wallet when 540000 VC are sent. (929ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 500 Ether to the ICO wallet when 540000 VC are sent. (963ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 809989.2 VC from the ICO wallet when 749.99 ether are sent. (904ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 809989.2 VC to the sender when 749.99 ether are sent. (972ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 749.99 Ether from the senders wallet when 809989.2 VC are sent. (1147ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 749.99 Ether to the ICO wallet when 809989.2 VC are sent. (935ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 817500 VC from the ICO wallet when 750 ether are sent. (840ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 817500 VC to the sender when 750 ether are sent. (874ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 750 Ether from the senders wallet when 817500 VC are sent. (988ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 750 Ether to the ICO wallet when 817500 VC are sent. (962ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 1089989.1 VC from the ICO wallet when 999.99 ether are sent. (1052ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 1089989.1 VC to the sender when 999.99 ether are sent. (786ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 999.99 Ether from the senders wallet when 1089989.1 VC are sent. (919ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 999.99 Ether to the ICO wallet when 1089989.1 VC are sent. (924ms)
    ✓ VC-L-1-* (ICO_RUNNING) It should deduct 1100000 VC from the ICO wallet when 1000 ether are sent. (791ms)
    ✓ VC-L-2-* (ICO_RUNNING) It should credit 1100000 VC to the sender when 1000 ether are sent. (737ms)
    ✓ VC-L-3-* (ICO_RUNNING) It should deduct 1000 Ether from the senders wallet when 1100000 VC are sent. (847ms)
    ✓ VC-L-4-* (ICO_RUNNING) It should add 1000 Ether to the ICO wallet when 1100000 VC are sent. (907ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 0.99 ether. (464ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 1 ether. (471ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 2 ether. (577ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 2.99 ether. (481ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 3 ether. (519ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 3.99 ether. (459ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 4 ether. (451ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 4.99 ether. (499ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 5 ether. (589ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 5.99 ether. (578ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 10 ether. (566ms)
    ✓ VC-L-0-* (PRE_ICO_RUNNING) It should fail to send 19.99 ether. (471ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 24550 VC from the ICO wallet when 20 ether are sent. (793ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 24550 VC to the sender when 20 ether are sent. (754ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 20 Ether from the senders wallet when 24550 VC are sent. (813ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 20 Ether to the ICO wallet when 24550 VC are sent. (862ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 30675.225 VC from the ICO wallet when 24.99 ether are sent. (673ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 30675.225 VC to the sender when 24.99 ether are sent. (705ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 24.99 Ether from the senders wallet when 30675.225 VC are sent. (1019ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 24.99 Ether to the ICO wallet when 30675.225 VC are sent. (827ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 30750 VC from the ICO wallet when 25 ether are sent. (746ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 30750 VC to the sender when 25 ether are sent. (711ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 25 Ether from the senders wallet when 30750 VC are sent. (825ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 25 Ether to the ICO wallet when 30750 VC are sent. (816ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 61487.7 VC from the ICO wallet when 49.99 ether are sent. (853ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 61487.7 VC to the sender when 49.99 ether are sent. (725ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 49.99 Ether from the senders wallet when 61487.7 VC are sent. (832ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 49.99 Ether to the ICO wallet when 61487.7 VC are sent. (867ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 62000 VC from the ICO wallet when 50 ether are sent. (714ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 62000 VC to the sender when 50 ether are sent. (724ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 50 Ether from the senders wallet when 62000 VC are sent. (975ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 50 Ether to the ICO wallet when 62000 VC are sent. (838ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 92987.6 VC from the ICO wallet when 74.99 ether are sent. (739ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 92987.6 VC to the sender when 74.99 ether are sent. (733ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 74.99 Ether from the senders wallet when 92987.6 VC are sent. (894ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 74.99 Ether to the ICO wallet when 92987.6 VC are sent. (884ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 93750 VC from the ICO wallet when 75 ether are sent. (716ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 93750 VC to the sender when 75 ether are sent. (692ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 75 Ether from the senders wallet when 93750 VC are sent. (888ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 75 Ether to the ICO wallet when 93750 VC are sent. (887ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 124987.5 VC from the ICO wallet when 99.99 ether are sent. (763ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 124987.5 VC to the sender when 99.99 ether are sent. (711ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 99.99 Ether from the senders wallet when 124987.5 VC are sent. (1048ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 99.99 Ether to the ICO wallet when 124987.5 VC are sent. (1190ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 126000 VC from the ICO wallet when 100 ether are sent. (729ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 126000 VC to the sender when 100 ether are sent. (715ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 100 Ether from the senders wallet when 126000 VC are sent. (873ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 100 Ether to the ICO wallet when 126000 VC are sent. (839ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 314987.4 VC from the ICO wallet when 249.99 ether are sent. (672ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 314987.4 VC to the sender when 249.99 ether are sent. (698ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 249.99 Ether from the senders wallet when 314987.4 VC are sent. (829ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 249.99 Ether to the ICO wallet when 314987.4 VC are sent. (799ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 317500 VC from the ICO wallet when 250 ether are sent. (879ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 317500 VC to the sender when 250 ether are sent. (680ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 250 Ether from the senders wallet when 317500 VC are sent. (810ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 250 Ether to the ICO wallet when 317500 VC are sent. (939ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 634987.3 VC from the ICO wallet when 499.99 ether are sent. (750ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 634987.3 VC to the sender when 499.99 ether are sent. (644ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 499.99 Ether from the senders wallet when 634987.3 VC are sent. (853ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 499.99 Ether to the ICO wallet when 634987.3 VC are sent. (866ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 640000 VC from the ICO wallet when 500 ether are sent. (640ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 640000 VC to the sender when 500 ether are sent. (758ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 500 Ether from the senders wallet when 640000 VC are sent. (929ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 500 Ether to the ICO wallet when 640000 VC are sent. (864ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 959987.2 VC from the ICO wallet when 749.99 ether are sent. (734ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 959987.2 VC to the sender when 749.99 ether are sent. (701ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 749.99 Ether from the senders wallet when 959987.2 VC are sent. (1001ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 749.99 Ether to the ICO wallet when 959987.2 VC are sent. (972ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 967500 VC from the ICO wallet when 750 ether are sent. (828ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 967500 VC to the sender when 750 ether are sent. (703ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 750 Ether from the senders wallet when 967500 VC are sent. (842ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 750 Ether to the ICO wallet when 967500 VC are sent. (826ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 1289987.1 VC from the ICO wallet when 999.99 ether are sent. (726ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 1289987.1 VC to the sender when 999.99 ether are sent. (687ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 999.99 Ether from the senders wallet when 1289987.1 VC are sent. (878ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 999.99 Ether to the ICO wallet when 1289987.1 VC are sent. (882ms)
    ✓ VC-L-1-* (PRE_ICO_RUNNING) It should deduct 1300000 VC from the ICO wallet when 1000 ether are sent. (730ms)
    ✓ VC-L-2-* (PRE_ICO_RUNNING) It should credit 1300000 VC to the sender when 1000 ether are sent. (677ms)
    ✓ VC-L-3-* (PRE_ICO_RUNNING) It should deduct 1000 Ether from the senders wallet when 1300000 VC are sent. (907ms)
    ✓ VC-L-4-* (PRE_ICO_RUNNING) It should add 1000 Ether to the ICO wallet when 1300000 VC are sent. (1012ms)


  196 passing (3m)


truffle(docker)> test test test/M-StateTransitionRegressionTest.js
Using network 'docker'.



  Contract: VC-M Tests all possible and impossible stage changes
    ✓ VC-M-1 should not be able to switch from DEPLOYED to DEPLOYED (no method).
    ✓ VC-M-2 should be able to switch from DEPLOYED to PRE_ICO_RUNNING. (432ms)
    ✓ VC-M-3 should not be able to switch from DEPLOYED to PRE_ICO_PAUSED. (417ms)
    ✓ VC-M-4 should not be able to switch from DEPLOYED to PRE_ICO_FINISHED. (399ms)
    ✓ VC-M-5 should not be able to switch from DEPLOYED to ICO_RUNNING. (520ms)
    ✓ VC-M-6 should not be able to switch from DEPLOYED to ICO_PAUSED. (505ms)
    ✓ VC-M-7 should not be able to switch from DEPLOYED to ICO_FINISHED. (438ms)
    ✓ VC-M-8 should not be able to switch from DEPLOYED to ACTIVE. (417ms)
    ✓ VC-M-9 should not be able to switch from PRE_ICO_RUNNING to DEPLOYED (no method).
    ✓ VC-M-10 should not be able to switch from PRE_ICO_RUNNING to PRE_ICO_RUNNING. (571ms)
    ✓ VC-M-11 should be able to switch from PRE_ICO_RUNNING to PRE_ICO_PAUSED. (578ms)
    ✓ VC-M-12 should be able to switch from PRE_ICO_RUNNING to PRE_ICO_FINISHED. (598ms)
    ✓ VC-M-13 should not be able to switch from PRE_ICO_RUNNING to ICO_RUNNING. (685ms)
    ✓ VC-M-14 should not be able to switch from PRE_ICO_RUNNING to ICO_PAUSED. (596ms)
    ✓ VC-M-15 should not be able to switch from PRE_ICO_RUNNING to ICO_FINISHED. (591ms)
    ✓ VC-M-16 should not be able to switch from PRE_ICO_RUNNING to ACTIVE. (638ms)
    ✓ VC-M-17 should not be able to switch from PRE_ICO_PAUSED to DEPLOYED (no method).
    ✓ VC-M-18 should be able to switch from PRE_ICO_PAUSED to PRE_ICO_RUNNING. (658ms)
    ✓ VC-M-19 should not be able to switch from PRE_ICO_PAUSED to PRE_ICO_PAUSED. (566ms)
    ✓ VC-M-20 should be able to switch from PRE_ICO_PAUSED to PRE_ICO_FINISHED. (606ms)
    ✓ VC-M-21 should not be able to switch from PRE_ICO_PAUSED to ICO_RUNNING. (643ms)
    ✓ VC-M-22 should not be able to switch from PRE_ICO_PAUSED to ICO_PAUSED. (595ms)
    ✓ VC-M-23 should not be able to switch from PRE_ICO_PAUSED to ICO_FINISHED. (556ms)
    ✓ VC-M-24 should not be able to switch from PRE_ICO_PAUSED to ACTIVE. (628ms)
    ✓ VC-M-25 should not be able to switch from PRE_ICO_FINISHED to DEPLOYED (no method).
    ✓ VC-M-26 should not be able to switch from PRE_ICO_FINISHED to PRE_ICO_RUNNING. (558ms)
    ✓ VC-M-27 should not be able to switch from PRE_ICO_FINISHED to PRE_ICO_PAUSED. (645ms)
    ✓ VC-M-28 should not be able to switch from PRE_ICO_FINISHED to PRE_ICO_FINISHED. (811ms)
    ✓ VC-M-29 should be able to switch from PRE_ICO_FINISHED to ICO_RUNNING. (1159ms)
    ✓ VC-M-30 should not be able to switch from PRE_ICO_FINISHED to ICO_PAUSED. (842ms)
    ✓ VC-M-31 should not be able to switch from PRE_ICO_FINISHED to ICO_FINISHED. (600ms)
    ✓ VC-M-32 should not be able to switch from PRE_ICO_FINISHED to ACTIVE. (600ms)
    ✓ VC-M-33 should not be able to switch from ICO_RUNNING to DEPLOYED (no method).
    ✓ VC-M-34 should not be able to switch from ICO_RUNNING to PRE_ICO_RUNNING. (784ms)
    ✓ VC-M-35 should not be able to switch from ICO_RUNNING to PRE_ICO_PAUSED. (605ms)
    ✓ VC-M-36 should not be able to switch from ICO_RUNNING to PRE_ICO_FINISHED. (788ms)
    ✓ VC-M-37 should not be able to switch from ICO_RUNNING to ICO_RUNNING. (913ms)
    ✓ VC-M-38 should be able to switch from ICO_RUNNING to ICO_PAUSED. (848ms)
    ✓ VC-M-39 should be able to switch from ICO_RUNNING to ICO_FINISHED. (722ms)
    ✓ VC-M-40 should not be able to switch from ICO_RUNNING to ACTIVE. (641ms)
    ✓ VC-M-41 should not be able to switch from ICO_PAUSED to DEPLOYED (no method).
    ✓ VC-M-42 should not be able to switch from ICO_PAUSED to PRE_ICO_RUNNING. (614ms)
    ✓ VC-M-43 should not be able to switch from ICO_PAUSED to PRE_ICO_PAUSED. (679ms)
    ✓ VC-M-44 should not be able to switch from ICO_PAUSED to PRE_ICO_FINISHED. (640ms)
    ✓ VC-M-45 should be able to switch from ICO_PAUSED to ICO_RUNNING. (644ms)
    ✓ VC-M-46 should not be able to switch from ICO_PAUSED to ICO_PAUSED. (698ms)
    ✓ VC-M-47 should be able to switch from ICO_PAUSED to ICO_FINISHED. (645ms)
    ✓ VC-M-48 should not be able to switch from ICO_PAUSED to ACTIVE. (643ms)
    ✓ VC-M-49 should not be able to switch from ICO_FINISHED to DEPLOYED (no method).
    ✓ VC-M-50 should not be able to switch from ICO_FINISHED to PRE_ICO_RUNNING. (734ms)
    ✓ VC-M-51 should not be able to switch from ICO_FINISHED to PRE_ICO_PAUSED. (678ms)
    ✓ VC-M-52 should not be able to switch from ICO_FINISHED to PRE_ICO_FINISHED. (645ms)
    ✓ VC-M-53 should not be able to switch from ICO_FINISHED to ICO_RUNNING. (615ms)
    ✓ VC-M-54 should not be able to switch from ICO_FINISHED to ICO_PAUSED. (734ms)
    ✓ VC-M-55 should not be able to switch from ICO_FINISHED to ICO_FINISHED. (689ms)
    ✓ VC-M-56 should be able to switch from ICO_FINISHED to ACTIVE. (688ms)
    ✓ VC-M-57 should not be able to switch from ACTIVE to DEPLOYED (no method).
    ✓ VC-M-58 should not be able to switch from ACTIVE to PRE_ICO_RUNNING. (723ms)
    ✓ VC-M-59 should not be able to switch from ACTIVE to PRE_ICO_PAUSED. (689ms)
    ✓ VC-M-60 should not be able to switch from ACTIVE to PRE_ICO_FINISHED. (658ms)
    ✓ VC-M-61 should not be able to switch from ACTIVE to ICO_RUNNING. (689ms)
    ✓ VC-M-62 should not be able to switch from ACTIVE to ICO_PAUSED. (680ms)
    ✓ VC-M-63 should not be able to switch from ACTIVE to ICO_FINISHED. (630ms)
    ✓ VC-M-64 should not be able to switch from ACTIVE to ACTIVE. (673ms)


  64 passing (36s)



truffle(docker)> test test/N-Gifts.js
Using network 'docker'.



  Contract: VC-N Gifts
    ✓ VC-N-1 It should give 10VC as gift. (868ms)
    ✓ VC-N-2 It should not give 10VC as a gift if there is no gift left. (825ms)
    ✓ VC-N-3 It should not give 10VC as a gift if the address is already gifted. (869ms)
    ✓ VC-N-4 should deduct the gifted VC from the ico wallet. (737ms)
    ✓ VC-N-5 should subtract 10 VC from the giftable amount. (816ms)
    ✓ VC-N-6 should credit 10VC to the sender address. (844ms)
    ✓ VC-N-7 should fail if the caller is not the contract owner. (743ms)
    ✓ VC-N-8 should fail if status is not ICO_RUNNING or PRE_ICO_RUNNING. (504ms)


  8 passing (6s)

truffle(docker)> 


```

## Development

The code is developed with the help of the open-zeppelin project as an audited 
base for secure contracts as well as the truffle framework to test the smart
contracts functionalities.

 - [open-zeppeling](https://github.com/OpenZeppelin/zeppelin-solidity)
 - [truffle framework](http://truffleframework.com/)

You can either use the development environment (docker) provided with source
in the `.docker` directory and exposed via Makefile.

Or you can install all dependencies by yourself.

## testrpc

The testrpc environment emulates a private ethereum network with following 
accounts:

| Name                     | Address                                  | Private key                              |
| ------------------------ | ---------------------------------------- | ---------------------------------------- |
| Contract owner           | 0x71ebee528022aac271498206a61640c4d8abdae0 | 2fe220ff5f98e096e6f7c63f47275e2317c435daaecf6c99ceec6a56c1ffe777 |
| Foundervision main       | 0x5f8a232439ea91c7075425a053095c0bd9ec34ac | a378d12e8b66f8e3c243cf5eebb45faffbdd0233c53ae0b13edd2e3b91850653 |
| Foundervision sponsoring | 0xa5c670e09dd61175cdbf72925a36e70d8dd3219f | 24b8f1f822f4d6a1f4659d59148b3617e4d4e0c5eeb70d41e2493bc0ee76941a |
| Buyer 1                  | 0xac1b473e46b62d473e3212486f7c4f81fa318a6b | 43c316bdbcfe585d2b6a8e2693a20d4aa02ca94ac788fcd6139dce0f3bb6e734 |
| Buyer 2                  | 0x4b70008773c4a73d964ce79a7a281e80870c8e6e | cfa5d7a6b9064c5dfa662927207a9f4fb6631a1b59498d265c637b9e43a567a8 |
| Buyer 3                  | 0x3ed1635d14f511c548052a07e7e4f927aff42a13 | 4b9938fd067aaf152de8d640e80037e19e00f20cb562b9ee6e0241e628a03c60 |
| Buyer 4                  | 0x680c65df80f95f88551f74f3e1fe536c6aad42b9 | 1c6269995a6a061c3cc2c883e774e6258e997c4219228fe218b5902190b8f51a |
| Buyer 5                  | 0x25f39fb991dd03661cb2238663ceda76938825c9 | a46d0828d326fdaf451f7bc1e3176b72d3907f4f47e69ff328217b2fa8064952 |
| Buyer 6                  | 0x849f6e68a8004853ffb31d1151078272ab5a8f72 | f3c09b99f382f9921c1b520efa80477962bc5d013f804b2251e4963facb33327 |
| Buyer 7                  | 0x5cdb61a2eedc3fafd49a2454f51b7f040f0d11cc | 233e0ed6d5eb3c44a2a149f4b55df5cbd732c1f8aa47c15f33aa57b3ef8bb69f |
| Buyer 8                  | 0xabad0a7a6ff6854cd1da14b09bdc7f685d29bed9 | 295a48aa1e7c41f6e232a82e53f6b873cb44674a986b8dceba1d314fb3c8846b |
| Buyer 9                  | 0x81ee36e0e470251051384219456f675299b1ffc0 | 3d50b90238332c38bbfa2c7af827534af3f449c78f6b614045552cae2ec507a2 |
| Buyer 10                 | 0x6840dc43f91012cf6b9607ccb1377895889c6530 | 42f8ffdf52bf8c88217ed61f448d0a1c2d9c77f1edac47ec818c6d1622ff26e6 |
| Buyer 11                 | 0x7b8d4de3a78be0892d90f1139ddb4cd4089db092 | 91920984632cb09176c17e24fb2f32cdcf13a81c724b65c41abb0bf7e1ee6b56 |
| Buyer 12                 | 0xb3992ad8ead4aec4d08c6ce8d08dd5361acf1243 | a34a7129ae4cb9446f4a899179106a37b48d2a5d0ea10a2d17085efb3670b742 |
| Buyer 13                 | 0x030dfbe4dbf4d96870d09b3049927db64c8bd131 | eda6f1c15aea9530dd4bd8c67345a434de458a56cce5748260b77c7baacf1d40 |
| Buyer 14                 | 0xe6dc47d94e0b765405e4de0ac10ef80b9e5587ef | 65afdd35e7e930a91ba33798785122e8627a8bcbcead305728ab619d765735ae |