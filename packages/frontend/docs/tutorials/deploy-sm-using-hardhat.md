---
title: Deploying a smart contract using Hardhat
slug: /tutorials/deploy-sm-using-hardhat
description: ""
---

This section guides you through deploying an NFT smart contract (an ERC-721 token) on the Funki using [Hardhat](https://hardhat.org/). Hardhat is a powerful developer tool that simplifies smart contract development, including deployment, testing, and debugging.

You'll discover how Hardhat's features enhance your workflow. Its integrated Solidity compiler and network management tools boost efficiency and reliability in smart contract development. Whether you're a seasoned blockchain developer or new to NFTs, this guide equips you with the knowledge to successfully deploy your smart contract on the Funki. 

---

## Objectives

By the end of this tutorial, you'll be able to:

- Set up Hardhat for Funki
- Create an NFT smart contract for Funki
- Compile a smart contract for Funki
- Deploy a smart contract to Funki
- Interact with a smart contract deployed on Funki

---

## Prerequisites[](#prerequisites)

### Node v18+[](#node-v18)

This tutorial requires you have Node version 18+ installed.

- Download [Node v18+](https://nodejs.org/en/download/)

If you are using `nvm` to manage your node versions, you can just run `nvm install 18`.

### Web3 wallet[](#coinbase-wallet)

To deploy a smart contract, you'll need a web3 wallet. Create one by installing a wallet browser extension:

- Install [Coinbase Wallet](https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad?hl=en)
- Install [MetaMask Wallet](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=metamask.io&pli=1)

### Wallet Funds

Deploying contracts to the blockchain incurs gas fees. You'll need to fund your wallet with ETH to cover these costs.

For this tutorial, you'll deploy a contract to the FunkiSepolia. To obtain Sepolia ETH, use one of the faucets listed on the Funki [Network Faucets](https://funkichain.com/portfolio/tokens?modal=claim-faucet) page.

---

## Creating a Project

Before deploying smart contracts to Funki, you'll need to set up your development environment by creating a Node.js project.

To create a new Node.js project, run:

```bash
npm init --y
```

Next, you will need to install Hardhat and create a new Hardhat project

To install Hardhat, run:

```bash
npm install --save-dev hardhat
```

To create a new Hardhat project, run:

```bash
npx hardhat init
```

Choose "Create a TypeScript project," then press *Enter* to confirm the project root. Select "y" for both adding a `.gitignore` file and including the sample project. The setup process will take a few moments to finish.

---

## Configuring Hardhat with Funki[](#configuring-hardhat-with-funki)

To deploy smart contracts to the Funki network, you'll need to configure your Hardhat project and add Funki as a network.

To configure Hardhat for Funki, add Funki as a network in your project's `hardhat.config.ts` file:

```solidity
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.23',
  },
  networks: {
    // for mainnet
    'funkiMainnet': {
      url: 'https://rpc-mainnet.funkichain.com',
      accounts: [process.env.WALLET_KEY as string],
    },
    // for testnet
    'funkiSepolia': {
      url: 'https://funki-testnet.alt.technology',
      accounts: [process.env.WALLET_KEY as string],
    },
    // for local dev environment
    'funkiLocal': {
      url: 'http://localhost:8545',
      accounts: [process.env.WALLET_KEY as string],
    },
  },
  defaultNetwork: 'hardhat',
};

export default config;
```

### Install Hardhat toolbox[](#install-hardhat-toolbox)

The configuration above utilizes the `@nomicfoundation/hardhat-toolbox` plugin. This plugin bundles all the commonly used packages and Hardhat plugins recommended for starting development with Hardhat.

To install `@nomicfoundation/hardhat-toolbox`, execute the following command:
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
```
### Loading Environment Variables

The configuration above uses [dotenv](https://www.npmjs.com/package/dotenv) to load the `WALLET_KEY` environment variable from a `.env` file into `process.env.WALLET_KEY`. This approach helps keep your private keys secure by avoiding hardcoding them in your source code.

To install `dotenv`, execute the following command:

```bash
npm install --save-dev dotenv
```

Once you have `dotenv` installed, you can create a `.env` file with the following content:

```
WALLET_KEY="<YOUR_PRIVATE_KEY>"
```

Substituting `<YOUR_PRIVATE_KEY>` with the private key for your wallet.

:::warning
`WALLET_KEY` is the private key of the wallet to use when deploying a contract. For instructions on how to get your private key from Metamask Wallet, visit the Metamask Wallett documentation or Coinbase Wallet documentation. It is critical that you do NOT commit this to a public repo
:::

### Local Networks[](#local-networks)

You can run the Funki network locally and deploy using it. It will take a **very** long time for your node to sync with the network. If you encounter errors stating that the `nonce has already been used` when attempting to deploy, it means your node isn't fully synced yet.

For quick testing, such as adding unit tests to the NFT contract below, you might prefer to keep the `defaultNetwork` as `'hardhat'`.

---

## Compiling the smart contract[](#compiling-the-smart-contract)

Below is a simple NFT smart contract (ERC-721) written in the Solidity programming language:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    uint256 public currentTokenId;

    constructor() ERC721("NFT Name", "NFT") {}

    function mint(address recipient) public payable returns (uint256) {
        uint256 newItemId = ++currentTokenId;
        _safeMint(recipient, newItemId);
        return newItemId;
    }
}
```

The Solidity code above defines a smart contract named `NFT`. It utilizes the `ERC721` interface from the [OpenZeppelin Contracts library](https://docs.openzeppelin.com/contracts/5.x/) to create an NFT smart contract. OpenZeppelin enables developers to use battle-tested, standardized smart contract implementations that comply with official ERC standards.

To incorporate the OpenZeppelin Contracts library into your project, execute the following command:

```bash
npm install --save @openzeppelin/contracts
```

In your project, delete the `contracts/Lock.sol` contract that was generated with the project and add the above code in a new file called `contracts/NFT.sol`. (You can also delete the `test/Lock.ts` test file, but it's highly recommended to add your own tests as soon as possible.)

To compile the contract using Hardhat, run:

```solidity
npx hardhat compile
```

---

## Deploying the smart contract[](#deploying-the-smart-contract)

Once your contract has been successfully compiled, you can deploy the contract to the FunkiSepolia.

To deploy the contract to the FunkiSepolia, you'll need to modify the `scripts/deploy.ts` in your project:

```solidity
import { ethers } from 'hardhat';

async function main() {
  const nft = await ethers.deployContract('NFT');

  await nft.waitForDeployment();

  console.log('NFT Contract Deployed at ' + nft.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

You'll also need testnet ETH in your wallet. See the [prerequisites](#prerequisites) if you haven't done that yet. Otherwise, the deployment attempt will fail.

Finally, run:

```bash
npx hardhat run scripts/deploy.ts --network funkiSepolia
```

The contract will be deployed on the FunkiSepolia. You can check the deployment status and view the contract using a [block explorer](https://testnet.funkiscan.io/) by searching for the address provided by your deploy script. If you've deployed an exact copy of the NFT contract described above, it will be pre-verified, allowing you to interact with it directly through the web interface.

:::info
If you'd like to deploy to mainnet, you'll modify the command like so:
```bash
npx hardhat run scripts/deploy.ts --network funkiMainnet
```
:::

Regardless of the network you're deploying to, if you're deploying a new or modified contract, you'll need to verify it first.

---

## Verifying the Smart Contract[](#verifying-the-smart-contract)

To interact with your contract on the block explorer, you or someone else needs to verify it first. The contract we've discussed has already been verified, so you should be able to view your deployed version on a block explorer immediately. For the rest of this tutorial, we'll guide you through verifying your contract on the FunkiSepolia.

In your `hardhat.config.ts` file, set up FunkiSepolia as a custom network. Add the following configuration to your `HardhatUserConfig`:

```solidity
etherscan: {
   apiKey: {
    "funkiSepolia": "PLACEHOLDER_STRING"
   },
   customChains: [
     {
       network: "funkiSepolia",
       chainId: 3397901,
       urls: {
        apiURL: "https://api.routescan.io/v2/network/testnet/evm/3397901/etherscan/api",
        browserURL: "http://testnet.funkiscan.io/"
       }
     }
   ]
 },
```

Or using the [RouterScan API](https://routescan.io/documentation/api-swagger) for contract verification. Currently, no API key is required, and your requests fall under their free plan.

> As of writing these docs, the RouteScan API free tier allows you to use the API without an API key, offering up to **2 requests per second (rps)** and **a daily limit of 10,000 calls.** Read more at [RouterScan API Plans](https://routescan.io/documentation#api-plans)
> 

> To verify a contract on FunkiSepolia, simply switch the chain information to [FunkiSepolia](https://docs.funkichain.com/docs/network-information). Currently, FunkiSepolia is an L2 of Sepolia Testnet, and its explorer is publicly available at [Funki Testnet Explorer](http://testnet.funkiscan.io/)
> 

Now, you can verify your contract on the Testnet. First, grab the deployed address and run:

```solidity
npx hardhat verify --network funkiSepolia <deployed address>
```

For Mainnet, simply change the network parameter:
```solidity
npx hardhat verify --network funkiMainet <deployed address>
```

:::info
You can't re-verify a contract identical to one that has already been verified. If you attempt to do so—for instance, verifying the contract we've discussed—you'll receive an error message similar to:

```solidity
Error in plugin @nomiclabs/hardhat-etherscan: 
The API responded with an unexpected message.
Contract verification may have succeeded and should be checked manually.
Message: Already Verified
```

To confirm your contract is verified, search for it on the explorer.
:::

---

## Interact with the Contract on FunkiScan[](#interact-with-the-contract)

You can now interact with your contract using [FunkiChain](https://docs.funkichain.com/docs/network-information). Click the *Contract* tab. If your contract is verified, you'll see the contract's source code and all its functions under the `Read Contract` and `Write Contract` buttons. Note that only write functions require an on-chain transaction.

To interact with write functions, you need to sign in to [FunkiChain](https://docs.funkichain.com/docs/network-information) with your wallet. Currently, you can choose from any of the supported wallet providers that appear.

![image.png](/img/connect-wallet.png)

Once connected, you're all set to interact with any write function of the contract. Make sure your input is correct and double-check the transaction details before confirming any transaction.

---

## Conclusion

We've covered deploying an NFT smart contract on FunkiSepolia using Hardhat. Here's what you need to know:
- Hardhat streamlines smart contract development with deployment, testing, and debugging tools.
- To set up a Hardhat project, configure networks, manage environment variables, and write Solidity code.
- Deployment involves compiling the contract, running scripts, and verifying on the blockchain explorer.
- Protect your private keys and never commit sensitive information to public repositories.
- After deployment and verification, interact with your contract through the blockchain explorer.