const ethers = require('ethers');
const provider = require('./setupProvider')();
const network = require('./__network')();

module.exports = function() {
    return new ethers.Wallet(network.privateKey, provider);
}
