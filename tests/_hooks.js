const fs = require('fs');
const sinon = require('sinon');
const faker = require('faker');
const ethers = require('ethers');
const wallet = new ethers.Wallet.createRandom();

const writeConfig = require('./writeConfig');
const clearCache = require('./clearCache');

const addressesFilePath = process.cwd() + '/config/addresses.js';
const addressesBackupFilePath = process.cwd() + '/config/backup.addresses.js';
const configAddressesFilecontents = fs.readFileSync( addressesFilePath, 'utf8');
writeConfig();

beforeEach(() => {
    clearCache();
    writeConfig();
    sinon.restore();
});

before(() => {
    if(fs.existsSync(addressesBackupFilePath)) {
        const backupFileContents = fs.readFileSync(addressesBackupFilePath, 'utf8');
        fs.writeFileSync(addressesFilePath, backupFileContents);
    fs.unlinkSync(addressesBackupFilePath);
    } else
        fs.writeFileSync(addressesBackupFilePath, configAddressesFilecontents);
});

after(() => {
    fs.writeFileSync(addressesFilePath, configAddressesFilecontents);
    fs.unlinkSync(addressesBackupFilePath);
});
