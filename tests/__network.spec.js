const chai = require('chai');
chai.use( require('chai-as-promised') );
const { expect } = chai;

const ethers = require('ethers');

const faker = require('faker');

const writeConfig = require('./writeConfig');
const clearCache = require('./clearCache');

describe('Network', function() {
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

    it('network: should return ethereum network !defaultNetwork', function() {
        writeConfig(config);

        const network = require('../src/__network')();

        expect(network).to.have.property('name', 'ethereum');
        expect(network).to.include(config.networks.ethereum);
    });

    it('network should return ethereum network if defaultNetwork = "ethereum"', function() {
        config.defaultNetwork = 'ethereum';
        writeConfig(config);

        const network = require('../src/__network')();
        expect(network).to.have.property('name', 'ethereum');
        expect(network).to.include(config.networks.ethereum);
    });

    ['polygon', 'avalanche', 'bsc', 'fantom', 'harmony'].forEach(networkName => {
        it('If defaultNetwork = ' + networkName + ', networks should return config.networks.' + networkName, function() {
            config.networks[networkName] = {
                url: faker.internet.url(),
                privateKey: new ethers.Wallet.createRandom().privateKey,
                chainId: 1
            }
            config.defaultNetwork = networkName;

            writeConfig(config);

            const network = require('../src/__network')();
            expect(network).to.have.property('name', networkName);
            expect(network).to.include(config.networks[networkName]);
        });
    });
});
