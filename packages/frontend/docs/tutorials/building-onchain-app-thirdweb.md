---
title: Building an onchain app using thirdweb
slug: tutorials/building-onchain-app-thirdweb
description: ""
---

In this tutorial, you'll learn how to build an app on Funki using the [thirdweb](https://portal.thirdweb.com/) platform.

You'll deploy a smart contract for an NFT collection and create an NFT gallery app to display the metadata details of each NFT within the collection.

---

## Objectives

By the end of this tutorial, you'll be able to:

- Create an NFT collection and mint new NFTs using thirdweb.
- Develop an NFT gallery app using a prebuilt thirdweb template.

---

## Prerequisites[](#prerequisites)

### 1. Setting Up a Web3 wallet[](#1-setting-up-a-coinbase-wallet)

To begin developing an app on Funki, you first need to set up a web3 wallet. We recommend using the Coinbase Wallet or Metamask Wallet, which can be easily created by downloading the Coinbase Wallet browser extension.

- Install [MetaMask Wallet](https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=metamask.io&pli=1)
- Install [Coinbase Wallet](https://chrome.google.com/webstore/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad?hl=en)

### 2. Wallet Funding[](#2-wallet-funding)

Blockchain transactions, including deploying smart contracts, necessitate a gas fee. Therefore, you will need to fund your wallet with ETH to cover those gas fees.

For this tutorial, you will be deploying a contract to the FunkiSepolia. You can fund your wallet with Funki Sepolia ETH using one of the faucets listed on the Funki [Network Faucets](https://funkichain.com/portfolio/tokens?modal=claim-faucet) page.

---

## Creating an NFT Collection[](#creating-an-nft-collection)

Before developing an app, you need to create an NFT collection via thirdweb.

Follow these steps to set up your NFT collection:

1. Visit the [thirdweb dashboard](https://thirdweb.com/dashboard).
2. Click the **Connect Wallet** button located in the upper right corner to connect your wallet.
3. From the dashboard, select [**Browse contracts**](https://thirdweb.com/explore) to explore a list of deployable smart contracts.
4. Navigate to the **NFTs** section and select the [**NFT Collection**](https://thirdweb.com/thirdweb.eth/TokenERC721) smart contract.
5. Click the **Deploy now** button.
6. Provide the required details for your NFT collection:
    1. Contract metadata (i.e. image, name, symbol, description)
    2. Network (Choose Funki Sepolia Sandbox)
7. Click **Deploy Now**.

![images/png](/img/thridweb-success-contract.png)

:::info
For production / mainnet deployments select `FunkiMainet`  as the network rather than `Funki Sepolia Sandbox`.
:::

Post-deployment, you can manage your smart contract via the [thirdweb dashboard](https://thirdweb.com/dashboard/contracts).

Currently, your NFT Collection lacks NFTs. To populate our upcoming NFT Gallery app, we will need to create several NFTs.

Follow the steps below to set metadata for new NFTs:

1. Visit the [thirdweb dashboard](https://thirdweb.com/dashboard).
2. From the dashboard, select [**View contracts**](https://thirdweb.com/dashboard/contracts) to view all your previously deployed contracts.
3. Select the NFT Collection smart contract you deployed.
4. Navigate to the **NFTs** tab on the left-hand sidebar.
5. Click **+Set NFT Metadata**.
6. Fill in the metadata details for the NFT (name, media, description, properties).
7. Click **Set NFT Metadata**.

Repeat these steps to set NFT Metadata as many NFTs as you'd like.

![images/png](/img/thirdweb-mint.png)

## Building an NFT Gallery App[](#building-an-nft-gallery-app)

Now that we have our NFT Collection, let's build an NFT Gallery App. The [thirdweb CLI](https://portal.thirdweb.com/cli) offers a variety of prebuilt and starter [templates](https://portal.thirdweb.com/templates) for popular app use-cases, significantly speeding up your development process.

For this tutorial, we'll use the [thirdweb CLI](https://portal.thirdweb.com/cli) to create a new app project with the [NFT Gallery template](https://github.com/thirdweb-example/nft-gallery).

Execute the following command:

```bash
npx thirdweb create --template nft-gallery
```

By default, the template is configured for an NFT collection on the Ethereum Mainnet. We'll modify the code to adapt our NFT collection to the FunkiSepolia.

Follow these steps to update the template:

1. Open the project in your preferred code editor.
2. Locate and open the `src/consts/parameters.ts` file.
    1. Change the `contractAddress` variable to your NFT collection's contract address (found on the thirdweb dashboard).
    2. Set the `chain` variable to `funkiSepolia`.
    3. Update the `blockExplorer` variable to `https://sepolia-sandbox.funkichain.com/`.
3. Open the `src/main.tsx` file.
4. Replace the entire contents of the file with the following code:

```solidity
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { FunkiSepolia } from "@thirdweb-dev/chains";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThirdwebProvider activeChain={FunkiSepolia}>
      <App />
    </ThirdwebProvider>
  </React.StrictMode>,
);
```

The above code imports and uses `FunkiSepolia` to be the `activeChain`.

:::info
For production / mainnet deployments, update the information above so that the chain variable is Funki (step ii), the blockExplorer is https://funkiscan.io (step iii), and update both instances of `FunkiSepolia` to `FunkiMainnet` in the example javascript code.
:::

---

## Running the Application

Now that you've updated the FunkiSepolia chain and your NFT collection's address, you're ready to view your NFT collection in the application.

To launch the application, execute the following command in the root directory:

```bash
yarn dev
```

---

## Conclusion

Congratulations on completing this tutorial! You've successfully learned how to create an NFT collection using Thirdweb, mint new NFTs, and build an NFT gallery app on the Funki blockchain.

For your next project, explore other prebuilt [smart contracts](https://thirdweb.com/explore) and starter [templates](https://portal.thirdweb.com/templates) offered by the [thirdweb](https://portal.thirdweb.com/) platform. These resources can help you develop your next onchain app on Funki with ease and efficiency.