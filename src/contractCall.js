const ethers = require('ethers');
const getABI = require('./getABI');
const setupWallet = require('./setupWallet');

/**
 * params: contractName, contractMethod[, methodParameters]
 * @param methodParameters should be an array of arguments to used in contract call
 */
module.exports = async function(_contractName, contractMethod) {
    const { addresses } = require('../config');

    let contractParameters = [];

    if(arguments.length > 2) {
        const arg3 = arguments[2];
        if(arg3) {
            if(Array.isArray(arg3))
                contractParameters = arg3;
        }
    }

    const wallet = setupWallet();

    let contractName = _contractName;

    switch(_contractName) {
        case 'controller':
        case 'controllerv3':
        case 'controllerV3':
            contractName = 'controllerV3';
            break;
        default:
    }

    const address = addresses[contractName];

    if(!address)
        return Promise.reject(new Error('Contract name not recognized or hasn\'t been deployed: ' + contractName));

    const contract = new ethers.Contract(addresses[contractName], getABI(contractName), wallet);

    try {
        return contract.estimateGas[contractMethod](...contractParameters)
            .then(estimatedGas => {
                const multiplied = estimatedGas.mul(150).div(100);
                return contract[contractMethod](...contractParameters, {gasLimit: multiplied})
            })
            .catch(e => {
                if(e.error && e.error.message && e.error.message.includes('Error:')) {
                    let body = e.error;
                    if(body.message.includes('Error: Error'))
                        body.message = body.message.replace('Error: ', '');

                    return Promise.reject(body);
                }
                else return Promise.reject(e);
            });
    } catch(e) {
        if(e.message.includes('contract[contractMethod] is not a function'))
            return Promise.reject(new TypeError(`${contractName}.${contractMethod} is not a function`));
        else return Promise.reject(e);
    }
}
