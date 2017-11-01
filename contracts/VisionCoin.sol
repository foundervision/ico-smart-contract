pragma solidity ^0.4.15;

// import zeppelin basics
import 'zeppelin-solidity/contracts/token/ERC20Basic.sol';
import 'zeppelin-solidity/contracts/token/StandardToken.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title VisionCoin Token Contract
 * @author Benjamin Ansbach <benjamin.ansbach@zandura.net>
 */
contract VisionCoin is StandardToken, Ownable /* REQ: VC-A-12 */
{
    using SafeMath for uint256;

    /// @dev The name of the token.
    /// REQ: VC-A-3
    string public name = "VisionCoin";

    /// @dev The symbol of the token.
    /// REQ: VC-A-2
    string public symbol = "VC";

    /// @dev The number of decimals
    /// REQ: VC-A-4
    uint256 public decimals = 18;

    /// @dev The total vision coin supply which is 200.000.000 with 18 decimals
    /// REQ: VC-A-1
    uint256 public totalSupply = 200000000 * (uint256(10) ** decimals);

    /// @dev The minimum amount for the pre-ico
    uint256 public minPreIcoAmount = 20;

    /// @dev The cap for the pre-ico
    /// REQ: VC-A-14
    uint256 public preIcoCap = 50000000 * (uint256(10) ** decimals);

    /// @dev The supply of coins which are giftable
    uint256 public giftable;

    /// @dev A mapping of addresses to "true" - addresses that already got a gift.
    mapping(address => bool) gifts;

    /// @dev A mapping of timestamp + stage
    mapping(uint256 => Stages) stageHistory;

    /// @dev The address which will receive the ico supply.
    address public icoWallet;

    /// @dev The address which will receive the other half of the supply
    address public founderVisionWallet;

    /// @dev The timestamp when the pre-ico phase starts.
    uint256 public startPreIco;

    /// @dev The timestamp when the ico ends.
    uint256 public endIco;

    /**
     * @dev The different stages the contract can be in.
     *  NONE: no stage, not deployed
     *  DEPLOYED: deployed to network, preparation, testing.
     *  PRE_ICO_RUNNING: Pre-ICO running
     *  PRE_ICO_PAUSED: Pre-ICO paused
     *  PRE_ICO_FINISHED: Pre-ICO finished
     *  ICO_RUNNING: ICO running
     *  ICO_PAUSED: ICO paused
     *  ICO_FINSIHED: ICO finished
     *  ACTIVE: ICO ended, only token transactions.
     */
    enum Stages {
    NONE,
    DEPLOYED,
    PRE_ICO_RUNNING,
    PRE_ICO_PAUSED,
    PRE_ICO_FINISHED,
    ICO_RUNNING,
    ICO_PAUSED,
    ICO_FINISHED,
    ACTIVE
    }

    /// @dev The current stage of the contract
    Stages public stage = Stages.NONE;

    /**
     * @dev Event that gets triggered when the stage of the contract changes.
     *
     * @param _fromStage The stage before the transition.
     * @param _toStage The stage after the transition.
     */
    event StageChanged(Stages _fromStage, Stages _toStage);

    /**
      * @dev Constructor
      *
      * @param _icoWallet The address of the wallet that holds the ico VCs.
      * @param _founderVisionWallet The address of FounderVision.
      * @param _startPreIco The date when the Pre-ICO starts.
      * @param _endIco The date when the ICO ends.
      * @param _minPreIcoAmount The minimum ether amount to participate in the pre ico
      * @param _giftable The giftable vc amount
      */
    function VisionCoin(
    address _icoWallet,
    address _founderVisionWallet,
    uint256 _startPreIco,
    uint256 _endIco,
    uint256 _minPreIcoAmount,
    uint256 _giftable) public
    {
        require(_icoWallet != 0x0);
        require(_founderVisionWallet != 0x0);

        /// REQ: VC-A-6
        require(msg.sender != _icoWallet);
        /// REQ: VC-A-7
        require(msg.sender != _founderVisionWallet);
        /// REQ: VC-A-8
        require(_founderVisionWallet != _icoWallet);

        /// check dates for the ico
        /// REQ: VC-A-5
        require(_endIco > _startPreIco);

        // assign constructor parameters
        /// REQ: VC-A-17
        icoWallet = _icoWallet;
        /// REQ: VC-A-18
        founderVisionWallet = _founderVisionWallet;

        /// REQ: VC-A-13
        giftable = _giftable;

        /// REQ: VC-A-19
        minPreIcoAmount = _minPreIcoAmount * (uint256(10) ** decimals);

        /// REQ: VC-A-15
        startPreIco = _startPreIco;
        /// REQ: VC-A-16
        endIco = _endIco;

        // ico funds for sale
        /// REQ: VC-A-9
        uint256 icoSupply = 100000000 * (uint256(10) ** decimals);
        balances[icoWallet] = icoSupply;
        Transfer(0x0, icoWallet, icoSupply);

        // foundervision
        /// REQ: VC-A-10
        uint256 fvSupply = 100000000 * (uint256(10) ** decimals);
        balances[founderVisionWallet] = fvSupply;
        Transfer(0x0, founderVisionWallet, fvSupply);

        // transition stage
        /// REQ: VC-A-11
        changeStage(Stages.DEPLOYED);
    }

    /**
     * @dev Gets a value indicating whether the contract stage equals the given
     * stage.
     *
     * @param _stage The stage to check the contracts stage against.
     */
    modifier requireStage(Stages _stage) {
        require(stage == _stage);
        _;
    }

    /**
     * @dev Gets a value indicating whether the first or the second given stage
     * matches the current contract stage.
     *
     * @param _stage1 The first stage to check the contracts stage against.
     * @param _stage2 The second stage to check the contracts stage against.
     */
    modifier requireStageOrStage(Stages _stage1, Stages _stage2) {
        require(stage == _stage1 || stage == _stage2);
        _;
    }

    /**
     * @dev Changes the current stage of the contract to the given stage.
     * @notice Changes the current stage of the contract to the given stage.
     * @param _newStage The new stage of the contract.
     */
    function changeStage(Stages _newStage) private
    {
        stageHistory[now] = _newStage;
        StageChanged(stage, _newStage);
        stage = _newStage;
    }

    /**
     * @notice This function will start the pre-ico phase.
     * @dev This function will start the pre-ico phase, if:
     *  - The function was called by the ico owner.
     *  - The current stage of the contract is Stages.DEPLOYED.
     *  - The current timestamp is gteq to the `startPreIco` date.
     *  - The current timestamp is lt to the `endIco` date.
     * REQ: VC-B-1
     */
    function startPreICO() onlyOwner /* VC-B-2 */ requireStage(Stages.DEPLOYED) /* VC-B-3 */ public
    {
        // check time ranges
        /// REQ: VC-B-4
        require(now >= startPreIco);

        /// REQ: VC-B-5
        require(now < endIco);

        // all fine, switch the stage
        changeStage(Stages.PRE_ICO_RUNNING);
    }

    /**
     * @notice This function will pause the Pre-ICO sales.
     * @dev This function will pause the pre-ico sales if:
     *  - The function was called by the ico owner.
     *  - The current stage of the contract is Stages.PRE_ICO_RUNNING.
     * REQ: VC-C-1
     */
    function pausePreICO() onlyOwner /* VC-C-2 */ requireStage(Stages.PRE_ICO_RUNNING) /* VC-C-3 */ public
    {
        changeStage(Stages.PRE_ICO_PAUSED);
    }

    /**
     * @notice This function will resume the paused Pre-ICO sales.
     * @dev This function will resume the paused pre-ico sales if:
     *  - The function was called by the ico owner.
     *  - The current stage of the contract is Stages.PRE_ICO_PAUSED.
     * REQ: VC-D-1
     */
    function resumePreICO() onlyOwner /* VC-D-2 */ requireStage(Stages.PRE_ICO_PAUSED) /* VC-D-3 */ public
    {
        changeStage(Stages.PRE_ICO_RUNNING);
    }

    /**
     * @notice This function will stop the pre-ico.
     * @dev This function will stop the pre-ico.
     *  - The function was called by the ico owner.
     *  - The current stage of the contract is Stages.PAUSED_PRE_ICO
     *  -  OR..
     *  - The current stage of the contract is Stages.PRE_ICO
     * REQ: VC-E-1 VC-E-2
     */
    function finishPreICO() onlyOwner /* VC-E-3 */ requireStageOrStage(Stages.PRE_ICO_PAUSED, Stages.PRE_ICO_RUNNING) /* VC-E-4 */ public
    {
        changeStage(Stages.PRE_ICO_FINISHED);
    }

    /**
     * @notice This function will start the ICO phase.
     * @dev This function will start the ICO phase, if:
     *  - The function was called by the ico owner.
     *  - The current stage of the contract is Stages.PRE_ICO_FINISHED.
     * REQ: VC-F-1
     */
    function startICO() onlyOwner /* VC-F-2 */ requireStage(Stages.PRE_ICO_FINISHED) /* VC-F-3 */ public
    {
        changeStage(Stages.ICO_RUNNING);
    }

    /**
     * @notice This function will pause the ico sales.
     * @dev This function will pause the ico sales if:
     *  - The function was called by the ico owner.
     *  - The current stage of the contract is Stages.ICO_RUNNING.
     * REQ: VC-G-1
     */
    function pauseICO() onlyOwner /* VC-G-2 */ requireStage(Stages.ICO_RUNNING) /* VC-C-3 */ public
    {
        changeStage(Stages.ICO_PAUSED);
    }

    /**
     * @notice This function will resume the paused Pre-ICO sales.
     * @dev This function will resume the paused pre-ico sales if:
     *  - The function was called by the ico owner.
     *  - The current stage of the contract is Stages.ICO_PAUSED.
     * REQ: VC-H-1
     */
    function resumeICO() onlyOwner /* VC-H-2 */ requireStage(Stages.ICO_PAUSED) /* VC-H-3 */ public
    {
        changeStage(Stages.ICO_RUNNING);
    }

    /**
     * @notice This function will end the token sale.
     * @dev  This function will end the token sale if
     *  - The function was called by the ico owner.
     *  - The current stage of the contract is Stages.ICO_RUNNING OR Stage.ICO_PAUSED.
     * REQ: VC-I-1, VC-I-2
     */
    function finishICO() onlyOwner /* VC-I-3 */ requireStageOrStage(Stages.ICO_RUNNING, Stages.ICO_PAUSED) /* VC-I-4 */ public
    {
        changeStage(Stages.ICO_FINISHED);
    }

    /**
     * @notice This function set the contracts stage to active.
     * @dev  This function will end the ICO if
     *  - The function was called by the ico owner.
     *  - The current stage of the contract is Stages.ICO_FINISHED.
     * REQ: VC-J-1
     */
    function setActive() onlyOwner /* VC-J-2 */ requireStage(Stages.ICO_FINISHED) /* VC-J-3 */ public
    {
        changeStage(Stages.ACTIVE);
    }

    /**
     * @notice This function will receive the payment and withdraws the vc
     * amount to the sender.
     */
    function() requireStageOrStage(Stages.PRE_ICO_RUNNING, Stages.ICO_RUNNING) /* VC-K-1, VC-K-2 */ public payable
    {
        /// REQ: VC-K-9, VC-K-11
        require(msg.value >= 0.01 ether);

        // if pre-ico, only gteq-minPreIcoAmount ether allowed
        if(stage == Stages.PRE_ICO_RUNNING) {
            /// REQ: VC-K-3, VC-K-4
            require(msg.value >= minPreIcoAmount);
        }

        // calculate the amount of tokens to transfer
        uint256 tokenAmount = calculateTokenAmount(msg.value);

        // if pre-ico and the cap is reached, transaction will fail
        if(stage == Stages.PRE_ICO_RUNNING) {
            /// REQ: VC-K-10
            require(balances[icoWallet].sub(tokenAmount) > preIcoCap);
        }

        /// REQ: VC-K-12
        require(balances[icoWallet] >= tokenAmount);

        // remove the amount of VCs from the ico owner
        /// REQ: VC-K-8
        balances[icoWallet] = balances[icoWallet].sub(tokenAmount);

        // update the amount of VCs for the sender
        /// REQ: VC-K-7
        balances[msg.sender] = balances[msg.sender].add(tokenAmount);

        // trigger event
        Transfer(icoWallet, msg.sender, tokenAmount);

        // transfer ether to ico wallet
        /// REQ: VC-K-5, VC-K-6
        icoWallet.transfer(msg.value);
    }


    /**
     * @notice Sends 10VC to the given address from the ICO funds wallet.
     * @dev Sends 10VC to the given address from the ICO funds wallet if
     *  - the ico wallet has 10 VC available
     *  - the giftable amount is greater or equals than 10VC
     *  - the address was not gifted before.
     * REQ: VC-N-1
     */
    function makeGift(address to) onlyOwner /* VC-N-7 */ requireStageOrStage(Stages.ICO_RUNNING, Stages.PRE_ICO_RUNNING) /* VC-N-8 */ public
    {
        require(balances[icoWallet] >= 10 ether);

        /// REQ: VC-N-2
        require(giftable >= 10);

        /// REQ: VC-N-3
        require(gifts[to] == false);

        // subtract 10 VC and save the address that was gifted
        /// REQ: VC-N-5
        giftable = giftable.sub(10);

        /// REQ: VC-N-3
        gifts[to] = true;

        // remove the amount of VCs from the ico owner
        /// REQ: VC-N-4
        balances[icoWallet] = balances[icoWallet].sub(10 ether);

        // update the amount of VCs for the sender
        /// REQ: VC-N-6
        balances[to] = balances[to].add(10 ether);

        // trigger event
        Transfer(icoWallet, to, 10 ether);
    }

    /**
     * @dev Calculates the amount of VCs in return for the given amount
     * of wei depending on current stage.
     *
     * @param weiAmount The transferred wei amount
     *
     * @return vcAmount
     * REQ: VC-L-*
     */
    function calculateTokenAmount(uint256 weiAmount) private constant returns(uint256 vcAmount)
    {
        // default multiplier
        uint256 mul = 100000;

        if (stage == Stages.PRE_ICO_RUNNING) {
            // +20% bonus during presale
            mul = mul.add(20000);
        }

        // add standard bonus
        mul = mul.add(calculateQuantityBonus(weiAmount));

        // calculate vc amount
        vcAmount = weiAmount
            .mul(1000) // now we have vc coins
            .mul(mul) // multiply by the bonus
            .div(100000); // divide by multiplier
    }


    /**
     * @dev Calculates the additional bonus depending the amount of ether sent
     *
     * @param weiAmount The amount of wei sent by the participator.
     * @return mul
     * REQ: VC-L-*
     */
    function calculateQuantityBonus(uint256 weiAmount) private constant returns(uint256 mul) {

        // the comparism is a bit misleading now, because we are comparing
        // the token amount with VC, where 1 ETH is comparable to 100 VC -> "100 ether" in solidity

        // + 10 %
        if(weiAmount >= 1000 ether) {
            return mul.add(10000);
        }
        // + 9 %
        if(weiAmount >= 750 ether) {
            return mul.add(9000);
        }
        // + 8 %
        if(weiAmount >= 500 ether) {
            return mul.add(8000);
        }
        // + 7 %
        if(weiAmount >= 250 ether) {
            return mul.add(7000);
        }
        // + 6 %
        if(weiAmount >= 100 ether) {
            return mul.add(6000);
        }
        // + 5 %
        if(weiAmount >= 75 ether) {
            return mul.add(5000);
        }
        // + 4 %
        if(weiAmount >= 50 ether) {
            return mul.add(4000);
        }
        // + 3 %
        if(weiAmount >= 25 ether) {
            return mul.add(3000);
        }
        // + 2.75 %
        if(weiAmount >= 20 ether) {
            return mul.add(2750);
        }
        // + 2.5 %
        if(weiAmount >= 10 ether) {
            return mul.add(2500);
        }
        // + 2 %
        if(weiAmount >= 5 ether) {
            return mul.add(2000);
        }
        // + 1.5 %
        if(weiAmount >= 4 ether) {
            return mul.add(1500);
        }
        // + 1 %
        if(weiAmount >= 3 ether) {
            return mul.add(1000);
        }
        // + 0,75 %
        if(weiAmount >= 2 ether) {
            return mul.add(750);
        }
        // + 0,5 %
        if(weiAmount >= 1 ether) {
            return mul.add(500);
        }

        return mul;
    }
}