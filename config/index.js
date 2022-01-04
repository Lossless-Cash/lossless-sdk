const _addresses = require('./addresses');
const network = require('../src/__network')();

module.exports = {
    addresses: _addresses[network.name]
}
