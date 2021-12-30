const deployContract = require('./deployContract');
const contractCall = require('../src/contractCall');

const chai = require('chai');
chai.use(
    require('chai-as-promised')
);
const { expect } = chai;
const { waffle, ethers } = require("hardhat");

describe('ContractCaller', function() {
    const provider = waffle.provider;
    let accounts;

    before(() => {
        return deployContract('LosslessGovernance')
            .then(() => ethers.getSigners())
            .then(res => {
                accounts = res;
            });
    });

    beforeEach(() => {
        contractCall.reset();
    });

    it('Fail if contract name is not one of the lossless contracts', function() {
        return Promise.all(
            ['controiler', 'governancev3', 'blahblah', 'badCpontractName'].map(name => 
                expect( contractCall(name, 'blah', provider) ).to.be.rejectedWith(Error, /Contract name not recognized/)
            )
        );
    });

    it('No params: Should fail if provider is not provided and hasn\'t previously been set', function() {
        return expect(contractCall('controller', 'version')).to.be.rejectedWith('"provider" is absent');
    });
    it('With params: Should fail if provider is not provided and hasn\'t previously been set', function() {
        return expect(contractCall('controller', 'getAvailableAmount', [accounts[3].address, accounts[4].address])).to.be.rejectedWith(Error, '"provider" is absent');
    });

    it('No params: Should only need to add provider once', function() {
        return contractCall('controller', 'getVersion', provider)
        .then(res => {
            expect(res).to.equal(3);
            return contractCall('controller', 'getVersion')
        }).then(res => expect(res).to.equal(3));
    });

    it('With params: Should only need to add provider once', function() {
        return contractCall('controller', 'isAddressProtected', [accounts[3].address, accounts[4].address], provider)
        .then(res => {
            expect(res).to.equal(false);
            return contractCall('controller', 'isAddressProtected', [accounts[3].address, accounts[4].address])
        }).then(res => expect(res).to.equal(false));
    });

    it('No params: Should call contract method if provider is present', async function() {
        expect( await contractCall('controller', 'getVersion', provider)).to.equal(3)
        expect( await contractCall('governance', 'getVersion', provider)).to.equal(1)
        expect( await contractCall('staking', 'getVersion', provider)).to.equal(1)
        expect( await contractCall('reporting', 'getVersion', provider)).to.equal(1)
    });

    it('With params: Should call contract method if provider is present', function() {
    // (address token, address protectedAddress) external view returns (bool) {
        return contractCall('controller', 'isAddressProtected', [accounts[3].address, accounts[4].address], provider)
        .then(res => expect(res).to.equal(false))
        // .then(() => contractCall('governance', 'getAvailableAmount', [accounts[3].address, accounts[4].address], provider)
    });
});
