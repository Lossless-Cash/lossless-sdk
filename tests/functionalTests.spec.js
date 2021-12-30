const { ethers } = require('hardhat');
const chai = require('chai');
chai.use( require('chai-as-promised') );
const { expect } = chai;

const { LosslessGovernance, LosslessReporting, LosslessStaking, LosslessControllerV3} = require('../src');
const { waffle } = require('hardhat');
const faker = require('faker');
const deployContract = require('./deployContract');

/*
 * These tests that the SDK is calling the contract correctly
 */
describe('Functional tests for the lossless sdk functions', function() {
    let accounts, contracts, governance, reporting, staking, controllerV3, adr, env;

    before(async () => {
        contracts = await deployContract();
        accounts = await ethers.getSigners();
    });

    beforeEach(() => {
        governance = new LosslessGovernance();
        reporting = new LosslessReporting();
        staking = new LosslessStaking();
        controllerV3 = new LosslessControllerV3();

        const provider = waffle.provider;

        const account = accounts[ faker.datatype.number({max: 9})];
        return governance.init(account)
            .then(() => reporting.init(account))
    });

    it('LosslessGovernance: getVersion() should return 1', function() {
        return governance.getVersion()
            .then(res => expect(res).to.equal(1))
    });

    it('LosslessStaking: getVersion() should return 1', function() {
        return staking.getVersion().then(res => expect(res).to.equal(1))
    });

    it('LosslessControllerV3: getVersion() should return 3', function() {
        return controllerV3.getVersion()
        .then(res => expect(res).to.equal(3));
    });

    it('LosslessReporting: getVersion() should return 1', function() {
        return reporting.getVersion()
        .then(res => expect(res).to.equal(1));
    });

    it('losslessGovernance.isCommitteeMember() should return false if account has no role', function() {
        const user = accounts[3].address;

        return governance.isCommitteeMember(user)
            .then(res => expect(res).to.equal(false));
    });
});

