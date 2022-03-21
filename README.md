# Lossless Contracts SDK (BETA)

This is a library to call [Lossless V3 contracts](https://github.com/Lossless-Cash/lossless-v3).

There are four classes that correspond to a Lossless V3 contract

- LosslessGovernance
- LosslessReporting
- LosslessStaking
- LosslessControllerV3

Each class can be imported from the module.

## SUPPORTED NETWORKS

`ropsten`
`rinkeby`

## How to use

```
npm i lossless-sdk
```

First, create a `lossless.config.js` file in the root of your project. It should look like this:

```js
module.exports = {
  defaultNetwork: "ropsten",
    networks: {
        ropsten: {
            url: 'http://example.blocks.net',
            chainId: 3,
            privateKey: '0xabck....'
        }
        ...
    }
}
```

Other networks include: `polygon, avalanche, bsc, fantom,` and `harmony`.
See [Mainnet addresses](https://lossless-cash.gitbook.io/lossless/technical-reference/lossless-controller/deployments)

In your code, import the sdk libraries corresponding to the contracts you want to call

example.js

```js
const { LosslessReporting } = require('@losslesscash/lossless-sdk');
// OR
// import { LosslessReporting  } from 'lossless-sdk');

async function main() {
  const reporting = new LosslessReporting();
  await reporting.report(
    "0x39fc984ce8a0082de41889080583aD31C730B1c7",
    "0x0299a45a955d0A0C0E3E1c6056abfd7357801F10"
  );

  return "done";
}

main().then(console.log).catch(console.log);

```

The ethers module can also be imported from this module

```
const { ethers } = require('lossless-sdk')
// OR
import { ethers } from 'lossless-sdk';
```
