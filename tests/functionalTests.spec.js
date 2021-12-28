const { ethers } = require('hardhat');
const chai = require('chai');
chai.use( require('chai-as-promised') );
const { expect } = chai;

const { LosslessGovernance } = require('../src/losslessGovernance');
const { waffle } = require('hardhat');
const faker = require('faker');
const deployContract = require('./deployContract');

describe('Functional tests for the lossless sdk functions', function() {
    let accounts, contracts, governance, adr, env;

    before(async () => {
        contracts = await deployContract();
        accounts = await ethers.getSigners();
    });

    beforeEach(() => {
        governance = new LosslessGovernance()
        const provider = waffle.provider;

        return governance.init(accounts[ faker.datatype.number({max: 9})])
    });

    it('getVersion() should return 1', function() {
        return governance.getVersion()
            .then(res => expect(res).to.equal(1));
    });

    it.skip('losslessGovernance.isCommitteeMember() should return false if account has no role', function() {
        const user = accounts[3].address;

        return governance.isCommitteeMember(user)
            .then(res => expect(res).to.equal(false));
    });
});

