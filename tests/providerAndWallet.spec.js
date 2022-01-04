const chai = require('chai');
chai.use( require('chai-as-promised') );
const { expect } = chai;

const sdk = require('../src');
const { ethers } = sdk;

const faker = require('faker');

const writeConfig = require('./writeConfig');
const clearCache = require('./clearCache');

describe('Wallet and Provider tests', function() {
    beforeEach(() => {
        clearCache();
    });

    it('provider: should use ethereum if !defaultNetwork', function() {
        const testURL = faker.internet.url();
        const config = {
            networks: {
                ethereum: {
                    url: testURL,
                    privateKey: new ethers.Wallet.createRandom().privateKey,
                    chainId: 1337
                }
            }
        };
        writeConfig(config);

        clearCache();

        const { provider } = require('../src');

        expect(provider).to.include.keys('connection');
        expect(provider.connection.url).to.equal(testURL);
    });

    it('setupWallet should use ethereum if !defaultNetwork', function() {
        const wallet = new sdk.ethers.Wallet.createRandom();
        const pk = wallet.privateKey;

        const config = {
            networks: {
                ethereum: {
                    url: faker.internet.url(),
                    privateKey: pk,
                    chainId: 1337
                },
                polygon: {
                    url: faker.internet.url(),
                    privateKey: (new sdk.ethers.Wallet.createRandom()).privateKey,
                    chainId: 1337
                }
            }
        };
        writeConfig(config);


        const setupWallet = require('../src/setupWallet');
        expect(setupWallet()).to.have.property('address', wallet.address);
    });
});
