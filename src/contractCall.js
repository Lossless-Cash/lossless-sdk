const ethers = require('ethers');
const getABI = require('./getABI');

let provider;
/**
 * params: contractName, contractMethod[, methodParameters[, provider]]
 * @param methodParameters should be an array of arguments to used in contract call
 */
module.exports = function(_contractName, contractMethod) {
    const { addresses } = require('../config');

    let contractParameters = [];

    if(arguments.length > 2) {
        // maybe one of the parameters is a provider

        const arg3 = arguments[2];
        const arg4 = arguments[3];
        if(arg3) {
            if(Array.isArray(arg3))
                contractParameters = arg3;
            else if(arg3 && typeof arg3 === 'object')
                provider = arg3;
        }

        if(arg4) {
            if(!Array.isArray(arg4) && typeof arg4 === 'object')
                provider = arg4;
        }
    }
    if(!provider)
        return Promise.reject(new Error('"provider" is absent'));
    // if(['controller', 'controller
    let contractName = _contractName;

    switch(_contractName) {
        case 'controller':
        case 'controllerv3':
        case 'controllerV3':
            contractName = 'controllerV3';
            break;
        default:
            contractName = _contractName;
            break;
    }

    const address = addresses[contractName];

    if(!address)
        return Promise.reject(new Error('Contract name not recognized or hasn\'t been deployed: ' + contractName));

    const contract = new ethers.Contract(addresses[contractName], getABI(contractName), provider);

    try {
        return contract[contractMethod](...contractParameters)
    } catch(e) {
        if(e.message.includes('contract[contractMethod] is not a function'))
            return Promise.reject(new TypeError(`${contractName}.${contractMethod} is not a function`));
        else return Promise.reject(e);
    }
}

module.exports.reset = function() {
    provider = null;
}
