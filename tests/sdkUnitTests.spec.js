const { ethers } = require('hardhat');
const chai = require('chai');
chai.use( require('chai-as-promised') );
const { expect } = chai;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const { LosslessGovernance } = require('../src/losslessGovernance');
const { LosslessReporting } = require('../src/losslessReporting');
const { LosslessStaking } = require('../src/losslessStaking');
const { LosslessControllerV3 } = require('../src/losslessControllerV3');
const { waffle } = require('hardhat');
const faker = require('faker');
const deployContract = require('./deployContract');

function createParameter(type) {
    let param;

    switch(type) {
        case 'int':
        case 'integer':
            param = faker.datatype.number();
            break;
        case 'address':
            param = faker.finance.ethereumAddress();
            break;
        case 'boolean':
            param = faker.datatype.boolean();
            break;
        case 'text':
        case 'string':
            param = faker.lorem.text();
            break;
    }

    if(param == null)
        throw new Error('Test fail: Param type ' + type + ' is not valid type');
    else
        return param;
}

[
    {name: 'LosslessControllerV3', sdkMethods: [
        {method: 'getVersion'},
        {method: 'isAddressProtected', params: ['address', 'address']},
        {method: 'getProtectedAddressStrategy', params: ['address', 'address']},
        {method: 'proposeNewSettlementPeriod', params: ['address', 'integer']},
        {method: 'executeNewSettlementPeriod', params: ['address']},
        {method: 'getLockedAmount', params: ['address', 'address']},
        {method: 'getAvailableAmount', params: ['address', 'address']},
    ]},
    {name:'LosslessReporting', sdkMethods: [
        {method: 'report', params: ['address', 'address']},
        {method: 'secondReport', params: ['integer', 'address']},
        {method: 'reporterClaim', params: ['integer']},
        {method: 'reporterClaimableAmount', params: ['integer']},
        {method: 'retrieveCompensation', params: ['address', 'integer']},
        {method: 'getVersion'},
        {method: 'version', actualMethod: 'getVersion'},
        {method: 'getRewards'},
    ]},
    {name: 'LosslessGovernance', sdkMethods: [
        { method: 'getVersion'},
        { method: 'version', actualMethod: 'getVersion'},
        { method: 'getVote', params: ['integer', 'integer']},
        { method: 'isCommitteeMember', params: ['address']},
        { method: 'tokenOwnersVote', params: ['integer', 'boolean']},
        { method: 'isCommitteeMember', params: ['address']},
        { method: 'isReportSolved', params: ['integer']},
        { method: 'reportResolution', params: ['integer']},
        { method: 'getIsVoted', params: ['integer', 'integer']},
        { method: 'committeeMemberVote', params: ['integer', 'boolean']},
        { method: 'resolveReport', params: ['integer']},
        { method: 'proposeWallet', params: ['integer', 'address']},
        { method: 'rejectWallet', params: ['integer']},
        { method: 'retrieveFunds', params: ['integer']},
        { method: 'retrieveCompensation', params: []},
        { method: 'claimCommitteeReward', params: ['integer']},
    ]},
    {name: 'LosslessStaking', sdkMethods: [
        {method: 'getVersion'},
        {method: 'version', actualMethod: 'getVersion'},
        {method: 'stake', params: ['integer']},
        {method: 'stakerClaimableAmount', params: ['integer']},
        {method: 'stakerClaim', params: ['integer']},
        {method: 'getIsAccountStaked', params: ['integer', 'address']},
        {method: 'getStakerCoefficient', params: ['integer', 'address']},
    // */
    ]}
].forEach(sdkTestArgs => {
    const { name } = sdkTestArgs
    describe('Tests for ' + sdkTestArgs.name + ' sdk functions', function() {
        let accounts, sdk, adr, env;

        before(async () => {
            accounts = await ethers.getSigners();
            await deployContract();
        });

        const contractMethods = sdkTestArgs.sdkMethods

        const contractName = (name == 'LosslessGovernance') ? 'governance' :
            (name == 'LosslessReporting') ? 'reporting' :
            (name == 'LosslessControllerV3') ? 'controllerV3' :
            (name == 'LosslessStaking') ? 'staking' : null;

        if(contractName == null)
            throw new Error('TestError: Invalid contract name - ' + name);

        beforeEach(() => {
            if(contractName === 'governance')
                sdk = new LosslessGovernance()
            else if(contractName === 'reporting')
                sdk = new LosslessReporting();
            else if(contractName === 'staking')
                sdk = new LosslessStaking();
            else
                sdk = new LosslessControllerV3();

            const provider = waffle.provider;

            return sdk.init(accounts[ faker.datatype.number({max: 9})])
        });

        contractMethods.filter(method => Array.isArray(method.params) && method.params.length > 0).forEach(args => {
            it(args.method + '() should fail if provided params are not correct', function() {
                const spy = sinon.fake.resolves(true);

                const path = '../src/' + name.substring(0, 1).toLowerCase() + name.substring(1);
                const SdkModule = proxyquire(path, {'./contractCall': spy});
                sdk = new SdkModule[name]();

                const parameterTypes = args.params;

                if(!parameterTypes)
                    throw new Error('TestError: parameters not defined');

                return Promise.all( parameterTypes.map((type, index) => {
                    const parameters = [];

                    if(type === 'int') type = 'integer';

                    parameterTypes.forEach((ot, j) => { 
                        if(j != index) {
                            const _param = createParameter(ot);
                            parameters[j] = _param;
                        }
                    });

                    const availableTypes = ['integer', 'address', 'boolean'];
                    const wrongTypes = availableTypes.filter(t => t !== type);

                    return Promise.all(wrongTypes.map(wrongType => {
                        const param = createParameter(wrongType);

                        parameters[index] = param;

                        if(!Array.isArray(parameters))
                            throw new Error('Test fail: Parameters must be an array');

                        return expect( sdk[args.method](...parameters) ).to.be.rejectedWith(TypeError, new RegExp('^' + args.method + '\\(\\):'));
                    }));
                }));
            });
        });

        contractMethods.forEach(args => {
            it(args.method + '() should call contractCall if provided params are correct', function() {
                const spy = sinon.fake.resolves(true);

                const contractMethodName = args.actualMethod || args.method;

                const path = '../src/' + name.substring(0, 1).toLowerCase() + name.substring(1);
                const SdkModule = proxyquire(path, {'./contractCall': spy});
                sdk = new SdkModule[name]();

                const parameterTypes = args.parameters || args.params || [];
                const parameters = parameterTypes.map(type => createParameter(type))

                if(!Array.isArray(parameters))
                    throw new Error('Test fail: Parameters must be an array');

                return sdk[args.method](...parameters)
                    .then(() => {
                        if(parameters.length > 0)
                            sinon.assert.calledWith(spy, contractName, contractMethodName, parameters)
                        else
                            sinon.assert.calledWith(spy, contractName, contractMethodName)
                    });
            });
        });
    });
});
