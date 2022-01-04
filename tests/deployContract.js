const { setupAddresses, setupEnvironment } = require('lossless-v3/test/utilsV3');
const configAddresses = require('../config/addresses');
const fs = require('fs');

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

    const deployedContracts = {
        governance: governance.address,
        controllerV3: controllerV3.address,
        reporting: reporting.address,
        staking: staking.address
    };

    const newAddresses = { ...configAddresses, ethereum: deployedContracts };
    let unquoted = JSON.stringify(newAddresses, null, 4).replace(/"([^"]+)":/g, '$1:');
    const fileText = 'module.exports = ' + unquoted;
    fs.writeFileSync(process.cwd() + '/config/addresses.js', fileText);

    return {
        staking, controllerV3, governance, reporting
    }
}
