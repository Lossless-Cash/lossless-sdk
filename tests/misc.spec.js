const { ethers, Provider } = require('../src');

const chai = require('chai');
chai.use( require('chai-as-promised') );
const { expect } = chai;


describe('Miscellaneous tests', function() {
    it('sdk should expose ethers', function() {
        // console.log('ethers:', ethers); expect(ethers).to.not.be.null;
        expect(ethers).to.be.an('object');
    });

    it('sdk should expose the Provider object', function() {
        expect(Provider).to.not.be.null;
        expect(Provider).to.not.be.undefined;

        expect(Provider).to.eql(ethers.providers.Provider);
    });
});
