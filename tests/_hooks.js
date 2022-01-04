const sinon = require('sinon');
const faker = require('faker');
const ethers = require('ethers');
const wallet = new ethers.Wallet.createRandom();

const writeConfig = require('./writeConfig');
const clearCache = require('./clearCache');

const config = {
    networks: {
        default: {
            url: 'http://localhost:8545',
            // url: faker.internet.url(),
            chainId: 1337,
            privateKey: wallet.privateKey
        },
        test: {
            // url: faker.internet.url(),
            url: 'http://localhost:8545',
            chainId: 1337,
            privateKey: wallet.privateKey
        }
    }
}
writeConfig(config);

beforeEach(() => {
    clearCache();
    sinon.restore();
});
