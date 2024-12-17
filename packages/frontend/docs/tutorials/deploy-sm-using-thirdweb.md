---
title: Deploying a smart contract using thirdweb
slug: /tutorials/deploy-sm-using-thirdweb
order: 5.4
description: ""
---

[Thirdweb](https://thirdweb.com/) is a powerful development framework that enables you to integrate web3 functionality into your applications. This tutorial will guide you through using the [thirdweb CLI](https://portal.thirdweb.com/cli) to deploy a smart contract on the FunkiSepolia.

---

## Objectives

By the end of this lesson, you'll be able to:

- Create a project with a smart contract using thirdweb
- Deploy smart contracts using thirdweb
- Interact with deployed smart contracts using thirdweb

---

## Prerequisites

The interactive thirdweb [command line interface (CLI)](https://portal.thirdweb.com/cli) provides all the tools necessary to create, build, and deploy smart contracts and apps to Funki.

For the most up-to-date version, we recommend using npx. However, you can also install the CLI globally on your machine:

```solidity
npm i -g @thirdweb-dev/cli
```

---

## Creating a project

The thirdweb [CLI](https://portal.thirdweb.com/cli) enables you to create a new project with a smart contract. You can also deploy pre-built contracts for NFTs, Tokens, or Marketplaces directly from the thirdweb [Explore](http://thirdweb.com/explore) page.

To create a new project using the CLI, run this command:

```bash
npx thirdweb create contract
```

This will initiate an interactive series of prompts to guide you through the setup process:

- Name your project
- Choose `Hardhat` as the framework
- Select `ERC721` for the base contract
- Opt for "None" when asked about optional [extensions](https://portal.thirdweb.com/contractkit/extensions)

### Exploring the project

The create command generates a new directory with your project name. Open this directory in your text editor.

Inside the `contracts` folder, you'll find a `Contract.sol` file—this is your smart contract written in Solidity!

Examining the code, you'll see that our contract inherits the functionality of [`ERC721Base`](https://portal.thirdweb.com/contractkit/base-contracts/erc-721/erc721base) by:

1. [Importing](https://solidity-by-example.org/import/) the contract
2. [Inheriting](https://docs.soliditylang.org/en/v0.8.17/contracts.html#inheritance) the contract (declaring that our contract is ERC721Base)
3. Implementing [required methods](https://portal.thirdweb.com/contractkit/base-contracts/erc-721/erc721base#implementing-the-contract), such as the [constructor](https://docs.soliditylang.org/en/v0.8.17/contracts.html#constructors)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC721Base.sol";

contract Contract is ERC721Base {
    constructor(
        string memory _name,
        string memory _symbol,
        address _royaltyRecipient,
        uint128 _royaltyBps
    ) ERC721Base(_name, _symbol, _royaltyRecipient, _royaltyBps) {}
}
```

This inheritance pattern lets us use functionality from other contracts inside of ours, modify it, and add custom logic.

For example, our contract currently implements all of the logic inside the [`ERC721Base.sol`](https://github.com/thirdweb-dev/contracts/blob/main/contracts/base/ERC721Base.sol) contract, which implements the [`ERC721A`](https://github.com/thirdweb-dev/contracts/blob/main/contracts/eip/ERC721A.sol) standard with several useful [extensions](https://portal.thirdweb.com/contractkit/extensions).

---

## Deploying the contract

You can use the thirdweb [CLI](https://portal.thirdweb.com/cli) to deploy a smart contract to Funki.

To deploy your smart contracts, from the root directory of your project, run:

```bash
npx thirdweb deploy
```

Running this command will:

- Compile all contracts in the current directory
- Allow you to select which contract(s) to deploy
- Upload your contract's source code ([ABI](https://docs.soliditylang.org/en/v0.8.17/abi-spec.html)) to [IPFS](https://docs.ipfs.tech/concepts/what-is-ipfs/)
- Open the deployment flow in the dashboard

From the dashboard, you'll need to enter the values for your contract's constructor:

- `_name`: Your contract's name
- `_symbol`: The "ticker" symbol for your contract's tokens
- `_royaltyRecipient`: The wallet address receiving royalties from secondary sales
- `_royaltyBps`: The basis points (bps) for royalties on each secondary sale (e.g., 500 = 5%)

Lastly, choose the FunkiSepolia as your deployment [network](https://blog.thirdweb.com/guides/which-network-should-you-use/), then click **Deploy Now**.

:::info
For production / mainnet deployments select `FunkiMainet` as the network rather than `FunkiSepolia`.
:::

Once your contract is deployed, you'll be redirected to a [dashboard](https://thirdweb.com/dashboard) for managing your contract.

---

## Interacting with your contract

Thirdweb provides SDKs for various programming languages, including [React](https://portal.thirdweb.com/react), [React Native](https://portal.thirdweb.com/react-native), [TypeScript](https://portal.thirdweb.com/typescript), [Python](https://portal.thirdweb.com/python), [Go](https://portal.thirdweb.com/go), and [Unity](https://portal.thirdweb.com/unity).

To interact with your smart contract, you can use the thirdweb [CLI](https://portal.thirdweb.com/cli) to create a web application that is pre-configured with the [thirdweb React SDK](https://portal.thirdweb.com/react).

To create a web application preconfigured with the thirdweb SDK, run:

```bash
npx thirdweb create app --evm
```

This will kick off an interactive series of questions to help you get started:

- Give your project a name
- Select [`Create React App`](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) as the framework
- Select `TypeScript` as the language

### Exploring the project

The create command generates a new directory with your project name. Open this directory in your text editor.

In the [`index.tsx`](https://github.com/thirdweb-example/cra-typescript-starter/blob/main/src/index.tsx#L17-L19) file, you'll find the [`ThirdwebProvider`](https://portal.thirdweb.com/sdk/set-up-the-sdk/frontend#manual-installation) wrapping the entire application.

This wrapper enables the use of all [React SDK](https://portal.thirdweb.com/react) hooks and [UI Components](https://portal.thirdweb.com/react/react.web3button) throughout the application. It also allows you to configure an `activeChain`, which specifies the blockchain network for your smart contracts.

Since we deployed our smart contract to the Funki network, we'll set the `activeChain` to `FunkiSepolia`:

```solidity
...
import { FunkiSepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
 &lt;React.StrictMode&gt;
   &lt;ThirdwebProvider activeChain={FunkiSepolia}&gt;
     &lt;App /&gt;
   &lt;/ThirdwebProvider&gt;
 &lt;/React.StrictMode&gt;
);
```

### Interacting with the contract

To connect to your smart contract in the application, provide your smart contract address (which you can get from the [dashboard](https://portal.thirdweb.com/dashboard)) to the [`useContract`](https://portal.thirdweb.com/sdk/interacting-with-contracts/custom-contracts/getting-a-contract#connect-to-a-contract) hook like so:

```solidity
import { useContract } from '@thirdweb-dev/react';

export default function Home() {
  const { contract } = useContract('&lt;CONTRACT_ADDRESS&gt;');

  // Now you can use the contract in the rest of the component!
}
```

You can now call any function on your smart contract with [`useContractRead`](https://portal.thirdweb.com/sdk/interacting-with-contracts/custom-contracts/using-contracts#read-contract-data) and [`useContractWrite`](https://portal.thirdweb.com/sdk/interacting-with-contracts/custom-contracts/using-contracts#write-transactions) hooks.

For example, you can call `useContractRead` to get the name of the contract:

```solidity
const { data, isLoading } = useContractRead(contract, 'name');
```

The thirdweb SDK offers hooks for various interfaces and [extensions](https://portal.thirdweb.com/contractkit/extensions), simplifying data reading and writing. For instance, we can use [ERC721 hooks](https://portal.thirdweb.com/sdk/interacting-with-contracts/erc721) to retrieve metadata for our NFT contract.

To learn more about interacting with smart contracts using the thirdweb SDK, check out the [thirdweb developer documentation](https://portal.thirdweb.com/react).

### Deploying the project

To [host your application on IPFS](https://blog.thirdweb.com/guides/how-to-host-your-web-app-on-ipfs/), run the following command:

```bash
yarn deploy
```

This command uses [Storage](https://portal.thirdweb.com/storage) to:

- Create a production build of your application
- Upload the build to IPFS
- Generate a URL where your app is permanently hosted

That's it! You now have a web application that interacts with smart contracts deployed to Funki!