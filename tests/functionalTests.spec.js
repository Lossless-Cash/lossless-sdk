require('./clearCache')();
require('./writeConfig')('default');

const { ethers } = require('hardhat');
const chai = require('chai');
chai.use( require('chai-as-promised') );
const { expect } = chai;
const deployContracts = require('./deployContract');

const { LosslessGovernance, LosslessReporting, LosslessStaking, LosslessControllerV3} = require('../src');
const faker = require('faker');

/*
 * These tests that the SDK is calling the contract correctly
 */
describe('Functional tests for the lossless sdk functions', function() {
    let accounts, governance, reporting, staking, controllerV3,
        sdkObjects;

    before(async () => {
        accounts = await ethers.getSigners();

        await deployContracts()
    });

    beforeEach(() => {
        governance = new LosslessGovernance();
        reporting = new LosslessReporting();
        staking = new LosslessStaking();
        controllerV3 = new LosslessControllerV3();

        sdkObjects = {
            reporting, governance, controllerV3, staking
        };
    });

    describe('No parameters', function() {
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

        it('LosslessReporting: getRewards()', function() {
            return reporting.getRewards()
                .then(res => expect(res).to.have.lengthOf(4));
        });
    });

    describe('One or more parameters', function() {
        it('losslessGovernance.isCommitteeMember() should return false if account has no role', function() {
            const user = accounts[3].address;

            return governance.isCommitteeMember(user)
                .then(res => expect(res).to.equal(false));
        });
        it('losslessControllerV3.isAddressProtected()', function() {
            const token = faker.finance.ethereumAddress();
            const address = faker.finance.ethereumAddress();

            return controllerV3.isAddressProtected(token, address)
                .then(res => expect(res).to.equal(false));
        });
        
        // These functions will fail because the conditions needed for them to pass are not in place.
        // This test will check that the function calls fail with a revert, (ie require(asdf == true, 'reason string');

        [
            {contractName: 'reporting', functions: [
                {methodName: 'report', params: [faker.finance.ethereumAddress(), faker.finance.ethereumAddress()]}
            ]},
            {contractName: 'staking', functions: [
                {methodName: 'stakerClaim', params: [faker.datatype.number()]}
            ]},
        ].forEach(({contractName, functions}) => {
            functions.forEach(({methodName, params}) => {
                it('lossless' + contractName.substring(0, 1).toUpperCase() + contractName.substring(1) + '.' + methodName + '()', function() {
                    /*
                    return sdkObjects[contractName][methodName](...params)
                    .then(tx => tx.wait())
                    .then(res => console.log('ress:', res));
                    */
                    return expect(
                        sdkObjects[contractName][methodName](...params)
                    ).to.be.rejectedWith(/^Error: VM Exception while processing transaction: reverted with reason string/);
                });
            });
        });
    });
});

