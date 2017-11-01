const TimeController = require('./TimeController.js');
const Helper = require('./Helper.js');
const VisionCoin = artifacts.require('./VisionCoin.sol');

/**
 * A helper class to create a smart contract testing environment.
 */
module.exports = class ContractBuilder
{
    /**
     *
     * @param walletRepository
     */
    constructor(walletRepository)
    {
        this.walletRepository = walletRepository;
        this.timeController = new TimeController();

        // preico start is immediately
        this.setPreIcoStart(0);
        // ico will end after 2 days
        this.setIcoEnd(1);

        this.setIcoWallet(this.walletRepository.getIcoAddress());
        this.setFounderVisionWallet(this.walletRepository.getFounderVisionAddress());
        this.setMinPreIcoAmount(10);
    }

    /**
     * Sets the date when the pre-ico should start. (relative to the creation
     * date of the contract)
     *
     * @param {Number} days The number of days when the pre-ICO should start.
     * @return {ContractBuilder}
     */
    setPreIcoStart(days)
    {
        this.preIcoStart = this.timeController.current() + (days * 24 * 60 * 60);
        return this;
    }

    /**
     * Gets the pre-ico start date.
     *
     * @returns {Number}
     */
    getPreIcoStart()
    {
        return this.preIcoStart;
    }

    /**
     * Gets the ico end date.
     *
     * @returns {Number}
     */
    getIcoEnd()
    {
        return this.icoEnd;
    }

    /**
     * Sets the days when the ICO should end (relative to the creation date
     * of the contract).
     *
     * @param {Number} days
     * @return {ContractBuilder}
     */
    setIcoEnd(days)
    {
        this.icoEnd = this.timeController.current() + (days * 24 * 60 * 60);
        return this;
    }

    /**
     * This will prepare the conditions for the pre-ico phase.
     *
     * @returns {Promise.<void>}
     */
    async prepareSuccessfulPreIcoStageChange()
    {
        await this.timeController.addSeconds(this.preIcoStart - this.timeController.current());
    }

    /**
     * Adds the given days to the current time.
     *
     * @param {Number} days
     * @returns {Promise.<void>}
     */
    async addDaysToNow(days)
    {
        await this.timeController.addSeconds(days * 24 * 60 * 60);
    }

    /**
     * Sets the ico wallet.
     *
     * @param {WalletAddress} wallet
     * @return {ContractBuilder}
     */
    setIcoWallet(wallet) {
        this.icoWallet = wallet;
        return this;
    }

    /**
     * Sets the foundvision wallet.
     *
     * @param {WalletAddress} wallet
     * @return {ContractBuilder}
     */
    setFounderVisionWallet(wallet) {
        this.founderVisionWallet = wallet;
        return this;
    }

    /**
     * Sets minimum amount of ether  to participate in the pre ico.
     *
     * @param {int} amount
     * @return {ContractBuilder}
     */
    setMinPreIcoAmount(amount) {
        this.minPreIcoAmount = amount;
        return this;
    }

    /**
     * Creates and returns a new
     * @returns {Contract}
     */
    async build(stage, giftable)
    {
        this.contract = await VisionCoin.new(
            this.icoWallet.getAddress(),
            this.founderVisionWallet.getAddress(),
            this.preIcoStart,
            this.icoEnd,
            this.minPreIcoAmount,
            giftable === undefined ? 250000 : giftable
        );

        if(stage !== undefined) {
            await this.goToStage(stage);
        }

        return this.contract;
    }

    async assertStage(stage)
    {
        const contractStage = await this.contract.stage.call();
        assert.equal(stage, contractStage.toNumber(),
            'Stage not changed to ' + stage);
    }

    async goToStage(stage) {
        switch(stage) {
            case Helper.STAGES.PRE_ICO_RUNNING:
                this.prepareSuccessfulPreIcoStageChange();
                await this.contract.startPreICO();
                break;
            case Helper.STAGES.PRE_ICO_PAUSED:
                this.prepareSuccessfulPreIcoStageChange();
                await this.contract.startPreICO();
                await this.contract.pausePreICO();
                break;
            case Helper.STAGES.PRE_ICO_FINISHED:
                this.prepareSuccessfulPreIcoStageChange();
                await this.contract.startPreICO();
                await this.contract.finishPreICO();
                break;
            case Helper.STAGES.ICO_RUNNING:
                this.prepareSuccessfulPreIcoStageChange();
                await this.contract.startPreICO();
                await this.contract.finishPreICO();
                await this.contract.startICO();
                break;
            case Helper.STAGES.ICO_PAUSED:
                this.prepareSuccessfulPreIcoStageChange();
                await this.contract.startPreICO();
                await this.contract.finishPreICO();
                await this.contract.startICO();
                await this.contract.pauseICO();
                break;
            case Helper.STAGES.ICO_FINISHED:
                this.prepareSuccessfulPreIcoStageChange();
                await this.contract.startPreICO();
                await this.contract.finishPreICO();
                await this.contract.startICO();
                await this.contract.finishICO();
                break;
            case Helper.STAGES.ACTIVE:
                this.prepareSuccessfulPreIcoStageChange();
                await this.contract.startPreICO();
                await this.contract.finishPreICO();
                await this.contract.startICO();
                await this.contract.finishICO();
                await this.contract.setActive();
                break;
        }

        this.assertStage(stage);
    }
};