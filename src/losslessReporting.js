const contractCall = require('./contractCall');
const { isAddress, isInteger } = require('./utils');

function badParam(message) {
    return Promise.reject( new TypeError(message));
}

class LosslessReporting {
    init(provider) {
        return contractCall('reporting', 'getVersion', provider);
    }

    contract(methodName, parameters) {
        if(parameters && !Array.isArray(parameters))
            parameters = [parameters];
        if(parameters)
            return contractCall('reporting', methodName, parameters);
        else
            return contractCall('reporting', methodName);
    }

    version() {
        return this.contract('getVersion');
    }

    getVersion() {
        return this.version();
    }

    report(token, account) {
        if(!isAddress(token))
            return badParam('report(): token should be an address');
        else if(!isAddress(account))
            return badParam('report(): account should be an accress');
        else return this.contract('report', [token, account]);
    }

    secondReport(reportID, account) {
        if(!isInteger(reportID))
            return badParam('secondReport(): reportID should be an integer');
        else if(!isAddress(account))
            return badParam('secondReport(): account should be an address');
        else return this.contract('secondReport', [reportID, account]);
    }
    reporterClaim(reportID) {
        if(!isInteger(reportID))
            return badParam('reporterClaim(): reportID must be integer');
        return this.contract('reporterClaim', reportID);
    }

    reporterClaimableAmount(reportID) {
        if(isInteger(reportID))
            return this.contract('reporterClaimableAmount', reportID);
        else return badParam('reporterClaimableAmount(): reportID should be integer');
    }

    retrieveCompensation(address, amount) {
        if(!isAddress(address))
            return badParam('retrieveCompensation(): "address" should be an address');
        else if(!isInteger(amount))
            return badParam('retrieveCompensation(): "amount" should be integer');

        return this.contract('retrieveCompensation', [address, amount]);
    }

    getRewards() {
        return this.contract('getRewards');
    }
}

module.exports = { LosslessReporting }
