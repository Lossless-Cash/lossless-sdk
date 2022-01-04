const fs = require('fs');
const ethers = require('ethers');

module.exports = function(config) {
    if(config == 'default') {
        const privateKey = '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a';
        config = {
            networks: {
                default: {
                    url: 'http://localhost:8545',
                    chainId: 1337,
                    privateKey: privateKey
                },
                test: {
                    url: 'http://localhost:8545',
                    chainId: 1337,
                    privateKey: privateKey
                }
            }
        }
    }
    let unquoted = JSON.stringify(config, null, 4).replace(/"([^"]+)":/g, '$1:');
    const fileText = 'module.exports =' + unquoted;
    return fs.writeFileSync(process.cwd() + '/lossless.config.js', fileText);
}
