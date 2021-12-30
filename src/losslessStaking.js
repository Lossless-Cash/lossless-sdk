const contractCall = require('./contractCall');
const { isAddress, isInteger } = require('./utils');

function badParam(message) {
    return Promise.reject( new TypeError(message));
}

class LosslessStaking {
    async init(provider) {
        return contractCall('staking', 'getVersion', provider);
    }

    contract(methodName, parameters) {
        if(parameters && !Array.isArray(parameters))
            parameters = [parameters];
        if(parameters)
            return contractCall('staking', methodName, parameters);
        else
            return contractCall('staking', methodName);
    }

    getVersion() {
        return this.contract('getVersion');
    }

    version() {
        return this.getVersion();
    }

    stake(reportID) {
        if(!isInteger(reportID))
            return badParam('stake(): reportID should be an integer');
        else
            return this.contract('stake', reportID);
    }

    stakerClaimableAmount(reportID) {
        if(!isInteger(reportID))
            return badParam('stakerClaimableAmount(): reportID should be integer');
        return this.contract('stakerClaimableAmount', reportID);
    }

    stakerClaim(reportID) {
        if(!isInteger(reportID))
            return badParam('stakerClaim(): reportID should be an integer');
        else
            return this.contract('stakerClaim', reportID);
    }

    getIsAccountStaked(reportID, account) {
        if(!isInteger(reportID))
            return badParam('getIsAccountStaked(): reportID must be integer');
        else if(!isAddress(account))
            return badParam('getIsAccountStaked(): account must be an ethereum address');
        else
            return this.contract('getIsAccountStaked', [reportID, account]);
    }

    getStakerCoefficient(reportID, address) {
        if(!isInteger(reportID))
            return badParam('getStakerCoefficient(): reportID must be integer');
        else if(!isAddress(address))
            return badParam('getStakerCoefficient(): account must be an ethereum address');
        else
            return this.contract('getStakerCoefficient', [reportID, address]);
    }
}

module.exports = { LosslessStaking }
