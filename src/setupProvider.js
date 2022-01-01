const ethers = require('ethers');

module.exports = function() {
    const losslessConfig = require(process.cwd() + '/lossless.config.js');

    let networkName, network;

    switch(process.env.NODE_ENV) {
        case 'test':
        case 'development':
        default:
            networkName = process.env.NODE_ENV;
            break;

        case 'production':
        case undefined:
            network = losslessConfig.networks.default;
            networkName = 'default';
            break;
    }

    if(!network) {
        network = losslessConfig.networks[networkName];

        if(!network || !network.url)
            throw new Error('There is no network: ' + networkName);
    }

    const provider = new ethers.providers.JsonRpcProvider( network.url );
    return provider;
}
