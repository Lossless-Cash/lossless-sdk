const contractCall = require('./contractCall');
const { isAddress, isInteger } = require('./utils');

function badParam(message) {
    return Promise.reject( new TypeError(message));
}

class LosslessControllerV3 {
    contract(methodName, parameters) {
        if(parameters && !Array.isArray(parameters))
            parameters = [parameters];
        if(parameters)
            return contractCall('controllerV3', methodName, parameters);
        else
            return contractCall('controllerV3', methodName);
    }

    getVersion() {
        return this.contract('getVersion');
    }

    version() {
        return this.getVersion();
    }

    isAddressProtected(token, protectedAddress) {
        if(!isAddress(token))
            return badParam('isAddressProtected(): "token" should be token address');
        else if(!isAddress(protectedAddress))
            return badParam('isAddressProtected(): "protectedAddress" should be ethereum address');
        return this.contract('isAddressProtected', [token, protectedAddress]);
    }

    getProtectedAddressStrategy(token, protectedAddress) {
        if(!isAddress(token))
            return badParam('getProtectedAddressStrategy(): "token" should be address of token');
        else if(!isAddress(protectedAddress))
            return badParam('getProtectedAddressStrategy(): "protectedAddress" should be an address');
        else
            return this.contract('getProtectedAddressStrategy', [token, protectedAddress]);
    }

    proposeNewSettlementPeriod(token, seconds) {
        if(!isAddress(token))
            return badParam('proposeNewSettlementPeriod(): token should be an address');
        else if(!isInteger(seconds))
            return badParam('proposeNewSettlementPeriod(): seconds should be an integer');
        else return this.contract('proposeNewSettlementPeriod', [token, seconds]);
    }

    executeNewSettlementPeriod(token) {
        if(!isAddress(token))
            return badParam('executeNewSettlementPeriod(): token should be address of the token');
        return this.contract('executeNewSettlementPeriod', token);
    }
}

module.exports = { LosslessControllerV3 }
