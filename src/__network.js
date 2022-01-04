module.exports = function() {
    const losslessConfig = require(process.cwd() + '/lossless.config.js');

    let networkName, network;

    switch(losslessConfig.defaultNetwork) {
        default:
            networkName = losslessConfig.defaultNetwork, network;
            network = losslessConfig.networks[networkName];
            break;

        case null:
        case undefined:
        case 'mainnet':
        case 'production':
        case 'ethereum':
            network = losslessConfig.networks.ethereum;
            networkName = 'ethereum';
            break;
    }

    if(!network) {
        network = losslessConfig.networks[networkName];

        if(!network || !network.url)
            throw new Error('There is no network: ' + networkName);
    }

    network.name = networkName;

    return network;
}
