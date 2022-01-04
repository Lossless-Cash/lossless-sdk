const chai = require('chai');
chai.use( require('chai-as-promised') );
const { expect } = chai;

const ethers = require('ethers');

const faker = require('faker');

const writeConfig = require('./writeConfig');
const clearCache = require('./clearCache');

describe('Contract addresses', function() {
    const configAddresses = require('../config/addresses');
    clearCache();

    let config;

    beforeEach(() => {
        clearCache();

        config = {
            networks: {
                ethereum: {
                    url: faker.internet.url(),
                    privateKey: new ethers.Wallet.createRandom().privateKey,
                    chainId: 1337
                },
            }
        } 
    });

    it('config.addresses: should return mainnet addresses if no "defaultNetwork"', function() {
        writeConfig(config);

        const { addresses } = require('../config');
        expect(addresses).to.eql(configAddresses.ethereum);
    });

    it('network should return mainnet network if defaultNetwork = "ethereum"', function() {
        config.defaultNetwork = 'ethereum';
        writeConfig(config);

        const { addresses } = require('../config');
        expect(addresses).to.eql(configAddresses.ethereum);
    });

    ['polygon', 'avalanche', 'bsc', 'fantom', 'harmony'].forEach(networkName => {
        it('If defaultNetwork = ' + networkName + ', config.addresses should return contract addresses for network ' + networkName, function() {
            config.networks[networkName] = {
                url: faker.internet.url(),
                privateKey: new ethers.Wallet.createRandom().privateKey,
                chainId: 1
            }
            config.defaultNetwork = networkName;
            writeConfig(config);

            const { addresses } = require('../config');
            expect(addresses).to.eql(configAddresses[networkName]);
        });
    });
});
