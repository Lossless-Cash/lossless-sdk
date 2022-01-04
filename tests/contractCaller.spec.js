const chai = require('chai');
chai.use( require('chai-as-promised'));
const { expect } = chai;

const deployContract = require('./deployContract');
const writeConfig = require('./writeConfig');

const { ethers } = require("hardhat");
const clearCache = require('./clearCache');

describe('ContractCaller', function() {
    let contractCall;
    let accounts;

    before(() => {
        return deployContract('LosslessGovernance')
            .then(() => ethers.getSigners())
            .then(res => {
                accounts = res;
                const pks = ethers.Wallet.fromMnemonic('test '.repeat(11) + 'junk');

                const config = {
                    networks: {
                        default: {
                            url: 'http://localhost:8545',
                            chainId: accounts[0].provider._network.chainId,
                            privateKey: pks.privateKey
                        },
                        test: {
                            url: 'http://localhost:8545',
                            chainId: 1337,
                            privateKey: pks.privateKey
                        }
                    }
                }
                writeConfig(config);

                clearCache();
                contractCall = require('../src/contractCall');
            });
    });

    it('Fail if contract name is not one of the lossless contracts', function() {
        return Promise.all(
            ['controiler', 'governancev3', 'blahblah', 'badCpontractName'].map(name => 
                expect( contractCall(name, 'blah') ).to.be.rejectedWith(Error, /Contract name not recognized/)
            )
        );
    });

    it('No params: Should call contract method', async function() {
        expect( await contractCall('controller', 'getVersion')).to.equal(3)
        expect( await contractCall('governance', 'getVersion')).to.equal(1)
        expect( await contractCall('staking', 'getVersion')).to.equal(1)
        expect( await contractCall('reporting', 'getVersion')).to.equal(1)
    });

    it('With params: Should call contract method', function() {
        return contractCall('controller', 'isAddressProtected', [accounts[3].address, accounts[4].address])
        .then(res => expect(res).to.equal(false))
        // .then(() => contractCall('governance', 'getAvailableAmount', [accounts[3].address, accounts[4].address])
    });
});
