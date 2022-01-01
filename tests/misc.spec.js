const chai = require('chai');
chai.use( require('chai-as-promised') );
const { expect } = chai;

const sdk = require('../src');

const setupProvider = require('../src/setupProvider');

const losslessConfig = require('../lossless.config.js');

describe('Miscellaneous tests', function() {
    it('sdk should expose ethers and provider', function() {
        expect(sdk).to.include.keys('provider', 'ethers');
        expect(sdk.ethers).to.be.an('object');
        expect(sdk.provider).to.be.an('object');
    });

    it('sdk should expose the provider object', function() {
        const { provider } = sdk;
        expect(provider).to.not.be.null;
        expect(provider).to.not.be.undefined;

        expect(provider).to.include.keys('connection');
        expect(provider.connection.url).to.equal(losslessConfig.networks.default.url);
    });

    it('provider: should use test network if NODE_ENV ="test"', function() {
        console.log('cache src:', require.cache[ process.cwd() + '/src/index.js' ]);
        console.log(Object.keys(require.cache));
        console.log(Object.keys(require.cache).filter(key => key.includes('index.js')));
        delete require.cache[ process.cwd() + '/src/index.js' ];
        console.log('cache src:', require.cache[ process.cwd() + '/src/index.js' ]);

        process.env.NODE_ENV='test';

        const provider = setupProvider();

        expect(provider).to.include.keys('connection');
        expect(provider.connection.url).to.equal(losslessConfig.networks.test.url);
    });
});
