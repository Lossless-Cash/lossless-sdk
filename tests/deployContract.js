const { setupAddresses, setupEnvironment } = require('lossless-v3/test/utilsV3');

module.exports = async function() {
    const adr = await setupAddresses();
    const env = await setupEnvironment(adr.lssAdmin,
        adr.lssRecoveryAdmin,
        adr.lssPauseAdmin,
        adr.lssInitialHolder,
        adr.lssBackupAdmin
    );

    const staking = env.lssStaking;
    const controllerV3 = env.lssController;
    const governance = env.lssGovernance;
    const reporting = env.lssReporting;

    process.env.LOSSLESS_GOVERNANCE = governance.address
    process.env.LOSSLESS_CONTROLLER = controllerV3.address;
    process.env.LOSSLESS_REPORTING = reporting.address;
    process.env.LOSSLESS_STAKING = staking.address

    return {
        staking, controllerV3, governance, reporting
    }
}
