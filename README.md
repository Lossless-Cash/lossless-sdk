# Lossless Contracts SDK
This is a library to call [Lossless V3 contracts](https://github.com/Lossless-Cash/lossless-v3).


## How to use
```
npm i lossless-sdk
```

In your code, import the sdk libraries corresponding to the contracts you want to call

example.js
```
const { LosslessGovernance, LosslessReporting, LosslessStaking, LosslessControllerV3, ethers, Provider } = require('lossless-sdk');
// OR 
// import { LosslessGovernance, LosslessReporting, LosslessStaking, LosslessControllerV3, ethers, Provider  } from 'lossless-sdk');

const losslessGovernance = new LosslessGovernance();

const provider = new Provider(...);

await losslessGovernance.init( provider );

await losslessGovernance.reportResolution(reportID)
```

