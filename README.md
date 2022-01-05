# Lossless Contracts SDK
[![Tests](https://github.com/littlezigy/lossless-sdk/actions/workflows/tests.yml/badge.svg)](https://github.com/littlezigy/lossless-sdk/actions/workflows/tests.yml)

This is a library to call [Lossless V3 contracts](https://github.com/Lossless-Cash/lossless-v3).

There are four classes that correspond to a Lossless V3 contract
- LosslessGovernance
- LosslessReporting
- LosslessStaking
- LosslessControllerV3

Each class can be imported from the module.


## How to use
```
npm i lossless-sdk
```

First, create a `lossless.config.js` file in the root of your project. It should look like this:
```
module.exports = {
    networks: {
        ethereum: {
            url: 'http://example.blocks.net'
            chainId: 1,
            privateKey: '0xabck....'
        }
        ...
    }
}
```
See all the networks you can define under `networks` under [Mainnet addresses](https://lossless-cash.gitbook.io/lossless/technical-reference/lossless-controller/deployments)

In your code, import the sdk libraries corresponding to the contracts you want to call

example.js
```
const { LosslessGovernance } = require('lossless-sdk');
// OR 
// import { LosslessGovernance, provider  } from 'lossless-sdk');

const losslessGovernance = new LosslessGovernance();

await losslessGovernance.reportResolution(reportID)
```

The ethers object can also be imported from this module

```
const { ethers } = require('lossless-sdk')
// OR
import { ethers } from 'lossless-sdk';
```
