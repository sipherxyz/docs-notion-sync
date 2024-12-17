---
title: web3.js
slug: /tools/clients/web3
order: 6.9.4
description: Documentation for using web3.js, a JavaScript library for interacting with EVM-compatible blockchains. This page covers installation, setup, connecting to the Funki network and interacting with smart contracts.
keywords:
  [
    web3.js,
    Funki,
    Funki mainnet,
    Funki testnet,
    Funki network,
    JavaScript,
    EVM,
    client library,
    blockchain,
    smart contracts,
    Ethereum,
    RPC URL,
  ]
# hide_table_of_contents: true
---

# web3.js

[web3.js](https://web3js.org/) is a JavaScript library that allows developers to interact with EVM-compatible blockchain networks.

You can use web3.js to interact with smart contracts deployed on the Funki network.

---

## Install

To install web3.js run the following command:

```bash
npm install web3
```

## Setup

Before you can start using web3.js, you need to import it into your project.

Add the following line of code to the top of your file to import web3.js:

```javascript
//web3.js v1
const Web3 = require('web3');

//web3.js v4
const { Web3 } = require('web3');
```

## Connecting to Funki

You can connect to Funki by instantiating a new web3.js `Web3` object with a RPC URL of the Funki network:

```javascript
const { Web3 } = require('web3');

const web3 = new Web3('https://rpc-mainnet.funkichain.com');
```

:::info

To alternatively connect to Funki Sepolia (testnet), change the above URL from `https://rpc-mainnet.funkichain.com` to `https://funki-testnet.alt.technology`.

:::

## Accessing data

Once you have created a provider, you can use it to read data from the Funki network.

For example, you can use the `getBlockNumber` method to get the latest block:

```javascript
async function getLatestBlock(address) {
  const latestBlock = await web3.eth.getBlockNumber();
  console.log(latestBlock.toString());
}
```

## Deploying contracts

Before you can deploy a contract to the Funki network using web3.js, you must first create an account.

You can create an account by using `web3.eth.accounts`:

```javascript
const privateKey = “PRIVATE_KEY”;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
```

:::info

`PRIVATE_KEY` is the private key of the wallet to use when creating the account.

:::

## Interacting with smart contracts

You can use web3.js to interact with a smart contract on Funki by instantiating a `Contract` object using the ABI and address of a deployed contract:

```javascript
const abi = [
… // ABI of deployed contract
];

const contractAddress = "CONTRACT_ADDRESS"

const contract = new web3.eth.Contract(abi, contractAddress);
```

Once you have created a `Contract` object, you can use it to call desired methods on the smart contract:

```javascript
async function setValue(value) {
  // write query
  const tx = await contract.methods.set(value).send();
  console.log(tx.transactionHash);
}

async function getValue() {
  // read query
  const value = await contract.methods.get().call();
  console.log(value.toString());
}
```

:::info

<!-- For more information on deploying contracts on Funki, see [Deploying a Smart Contract](/guides/deploy-smart-contracts). -->

:::
