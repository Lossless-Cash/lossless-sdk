const chai = require('chai');
chai.use( require('chai-as-promised') );
const { expect } = chai;
const sdk = require('../src');

const losslessConfig = require('../lossless.config.js');

describe('Miscellaneous tests', function() {
    function clearCache() {
        delete require.cache[ process.cwd() + '/src/index.js' ];
        if(require.cache[ process.cwd() + '/src/setupProvider.js' ]) {
            require.cache[ process.cwd() + '/src/setupProvider.js' ].children.forEach(child => delete require.cache[ child.filename ]);
        }
        delete require.cache[ process.cwd() + '/src/setupProvider.js' ];
    }

    beforeEach(() => {
        clearCache();
    });

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
        expect(provider.connection.url).to.equal(losslessConfig.networks.ethereum.url);
    });
});
