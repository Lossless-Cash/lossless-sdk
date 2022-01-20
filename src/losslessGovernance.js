const contractCall = require('./contractCall');
const { isAddress, isInteger } = require('./utils');

function badParam(message) {
    return Promise.reject( new TypeError(message));
}

class LosslessGovernance {
    contract(methodName, parameters) {
        if(parameters && !Array.isArray(parameters))
            parameters = [parameters];
        if(parameters)
            return contractCall('governance', methodName, parameters);
        else
            return contractCall('governance', methodName);
    }

    getVersion() {
        return contractCall('governance', 'getVersion');
    }

    version() {
        return this.getVersion();
    }

    isCommitteeMember(addr) {
        if(!isAddress(addr))
            return Promise.reject(new TypeError('isCommitteeMember(): param "addr" must be an address'));

        return contractCall('governance', 'isCommitteeMember', [addr]);
    }

    getVote(reportID, voterIndex) {
        if(isInteger(reportID) && isInteger(voterIndex))
            return contractCall('governance', 'getVote', [reportID, voterIndex]);
        else
            return Promise.reject( new TypeError('getVote(): reportID and voterIndex must be integers'));
    }

    getIsVoted(reportID, voterIndex) {
        if(isInteger(reportID) && isInteger(voterIndex))
            return contractCall('governance', 'getIsVoted', [reportID, voterIndex]);
        else
            return Promise.reject( new TypeError('getIsVoted(): reportID and voterIndex must be integers'));
    }

    isReportSolved(reportID) {
        if(isInteger(reportID))
            return contractCall('governance', 'isReportSolved', [reportID]);
        else
            return Promise.reject( new TypeError('isReportSolved(): reportID must be an integer'));
    }

    reportResolution(reportID) {
        if(isInteger(reportID))
            return contractCall('governance', 'reportResolution', [reportID])
        else
            return Promise.reject( new TypeError('reportResolution(): param should be an integer') );
    }

    tokenOwnersVote(reportID, vote) {
        if(!isInteger(reportID))
            return Promise.reject( new TypeError('tokenOwnersVote(): params reportID should be an integer') );
        if(typeof vote != 'boolean')
            return Promise.reject( new TypeError('tokenOwnersVote(): param vote should be true or false') )

        return contractCall('governance', 'tokenOwnersVote', [reportID, vote]);
    }

    committeeMemberVote(reportID, vote) {
        if(!isInteger(reportID))
            return Promise.reject( new TypeError('committeeMemberVote(): param "reportID" should be an integer. ' + reportID));
        if(typeof vote != 'boolean' && !['true', 'false'].includes(vote))
            return Promise.reject( new TypeError('committeeMemberVote(): param "vote" should be true or false'));

        return this.contract('committeeMemberVote', [reportID, vote])
    }

    resolveReport(reportID) {
        if(isInteger(reportID))
            return this.contract('resolveReport', reportID);
        else
            return Promise.reject( new TypeError('resolveReport(): param "reportID" should be an integer but is ' + reportID));
    }

    proposeWallet(reportID, wallet) {
        if(!isInteger(reportID))
            return badParam('proposeWallet(): param "reportID" should be an integer');
        if(!isAddress(wallet))
            return badParam('proposeWallet(): param "wallet" should be an ethereum wallet address');

        return this.contract('proposeWallet', [reportID, wallet]);
    }

    rejectWallet(reportID) {
        if(!isInteger(reportID))
            return badParam('rejectWallet(): param "reportID" should be an integer')
        else
            return this.contract('rejectWallet', reportID);
    }

    retrieveFunds(reportID) {
        if(!isInteger(reportID))
            return badParam('retrieveFunds(): param "reportID" should be an integer');
        else
            return this.contract('retrieveFunds', reportID);
    }

    retrieveCompensation() {
        return this.contract('retrieveCompensation');
    }

    claimCommitteeReward(reportID) {
        if(isInteger(reportID))
            return this.contract('claimCommitteeReward', reportID);
        else return badParam('claimCommitteeReward(): reportID should be an integer');
    }
}

module.exports = { LosslessGovernance }
