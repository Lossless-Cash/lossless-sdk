require("@nomiclabs/hardhat-waffle");
require('hardhat-dependency-compiler');
require('@openzeppelin/hardhat-upgrades');

module.exports = {
    defaultNetwork: 'localhost',
    networks: {
        localhost: {
            gas: 'auto',
            gasPrice: 'auto'
        }
    },
    mocha: {
        require: '_hooks.js'
    },
    solidity: {
        compilers: [
            {
                version: '0.8.0',
                // version: '0.8.3',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: '0.5.16',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: '0.4.18',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: '0.6.6',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ]
    },
    dependencyCompiler: {
        paths: [
            "lossless-v3/contracts/utils/LERC20.sol",
            "lossless-v3/contracts/LosslessControllerV3.sol",
            "lossless-v3/contracts/utils/LosslessControllerV2.sol",
            "lossless-v3/contracts/utils/LosslessControllerV1.sol",
            "lossless-v3/contracts/LosslessGovernance.sol",
            "lossless-v3/contracts/LosslessReporting.sol",
            "lossless-v3/contracts/LosslessStaking.sol"
        ]
    },
    paths: {
        tests: "./tests",
        artifacts: "./artifacts"
    }
}
