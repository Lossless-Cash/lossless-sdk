module.exports = function(contractName) {
    let abi;

    switch(contractName) {
        case 'governance':
            abi = require('../artifacts/lossless-v3/contracts/LosslessGovernance.sol/LosslessGovernance.json').abi;
            break;
        case 'reporting':
            abi =  require('../artifacts/lossless-v3/contracts/LosslessReporting.sol/LosslessReporting.json').abi;
            break;
        case 'controllerV3':
            abi = require('../artifacts/lossless-v3/contracts/LosslessControllerV3.sol/LosslessControllerV3.json').abi;
                break;
        case 'staking':
            abi = require('../artifacts/lossless-v3/contracts/LosslessStaking.sol/LosslessStaking.json').abi;
                break;
    }

    return abi;
}
