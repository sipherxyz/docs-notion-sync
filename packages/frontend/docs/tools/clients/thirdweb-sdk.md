---
title: thirdweb SDK
slug: /tools/clients/thirdweb-sdk
order: 6.9.2
description: Documentation for using the thirdweb SDK for building web3 applications and interacting with smart contracts on Funki. This page covers installation, initialization, and functionalities in various programming languages.
keywords:
  [
    thirdweb SDK,
    thirdweb,
    Funki,
    Funki mainnet,
    Funki testnet,
    Funki network,
    web3 applications,
    smart contracts,
    React,
    TypeScript,
  ]
# hide_table_of_contents: true
---

# thirdweb SDK

thirdweb SDK is a library that enables developers to build web3 applications and interact with any EVM-compatible blockchain.

You can use the thirdweb SDK to build apps and interact with smart contracts deployed on the Funki network.

The thirdweb SDK is available in various programming languages, including: [React](https://portal.thirdweb.com/react), [React Native](https://portal.thirdweb.com/react-native), [TypeScript](https://portal.thirdweb.com/typescript), [Python](https://portal.thirdweb.com/python), [Go](https://portal.thirdweb.com/go), and [Unity](https://portal.thirdweb.com/unity).

Visit the [thirdweb documentation](https://portal.thirdweb.com/cli) for more instructions on using the thirdweb SDKs.

---

## Install

To install the thirdweb SDK, run:

```bash
npm install @thirdweb-dev/sdk ethers@5
```

---

## Initializing the SDK with Funki

To get started using the SDK, you must first initialize an instance of `ThirdWebSDK`, and connect to the Funki network by passing in the `Funki` chain.

To initialize the SDK with the Funki network and get a contract:

```javascript
import { Funki } from '@thirdweb-dev/chains';
import { ThirdwebSDK } from '@thirdweb-dev/sdk/evm';

const sdk = new ThirdwebSDK(Funki);
const contract = await sdk.getContract('0x0000000000000000000000000000000000000000');
```

:::info

The code snippet above uses the [React SDK](https://portal.thirdweb.com/react). The thirdweb SDKs are also available in [React Native](https://portal.thirdweb.com/react-native), [TypeScript](https://portal.thirdweb.com/typescript), [Python](https://portal.thirdweb.com/python), [Go](https://portal.thirdweb.com/go), and [Unity](https://portal.thirdweb.com/unity).

If alternatively you'd like to initialize the SDK with Funki Sepolia (testnet), use the following code instead:

```javascript
import { FunkiSepoliaSandbox } from '@thirdweb-dev/chains';
import { ThirdwebSDK } from '@thirdweb-dev/sdk/evm';

const sdk = new ThirdwebSDK(FunkiSepoliaSandbox);
const contract = await sdk.getContract('0x0000000000000000000000000000000000000000');
```

:::

---

## Interacting with smart contracts

Once you initialize the SDK and connect to a smart contract deployed to Funki, you can start calling functions on it using the SDK.

:::info

Any interaction you make with a smart contract will be made from the connected wallet automatically.

:::

### Using contract extension functions

The thirdweb SDK provides convenience functions when your smart contract uses [extensions](https://portal.thirdweb.com/contractkit/extensions). This is the easiest way to read data and write transactions with your smart contracts.

For example, if your contract implements the [ERC721](https://portal.thirdweb.com/contractkit/erc721) extension, you can utilize all of the functions of the [corresponding erc721 standard](https://portal.thirdweb.com/sdk/interacting-with-contracts/erc721) in the SDK.

As an example, below is a code snippet that uses [`useOwnedNFTs`](https://portal.thirdweb.com/react/react.useownednfts) hook to get a list of NFTs owned by a single wallet address:

```javascript
import { useOwnedNFTs } from '@thirdweb-dev/react';

const { data, isLoading, error } = useOwnedNFTs(contract, '{{wallet_address}}');
```

#### Usage

```javascript
import { useOwnedNFTs, useContract, useAddress } from '@thirdweb-dev/react';

// Your smart contract address
const contractAddress = '{{contract_address}}';

function App() {
  const address = useAddress();
  const { contract } = useContract(contractAddress);
  const { data, isLoading, error } = useOwnedNFTs(contract, address);
}
```

For more examples on using contract extension functions, visit the [thirdweb developer documentation](https://portal.thirdweb.com/sdk/interacting-with-contracts#using-contract-extensions).

### Reading contract data

If your contract doesn’t use any [extensions](https://portal.thirdweb.com/contractkit/extensions), or you want to directly call functions on your smart contract to read data, you can use the [`useContractRead`](https://portal.thirdweb.com/react/react.usecontractread) hook.

Read data on your contract from a connected wallet:

```javascript
const { contract } = useContract('{{contract_address}}');
const { data: myData, isLoading } = useContractRead(contract, 'myFunction');
```

### Writing transactions

If your contract doesn’t use any [extensions](https://portal.thirdweb.com/contractkit/extensions), or you want to directly call functions on your smart contract to write data, you can use the [`useContractWrite`](https://portal.thirdweb.com/react/react.usecontractwrite) hook.

Make transactions on your contract from a connected wallet:

```javascript
const { contract } = useContract('{{contract_address}}');
const { mutateAsync: myFunctionAsync } = useContractWrite(contract, 'myFunction');
const tx = await myFunctionAsync(['argument1', 'argument2']); // Call the function
```
