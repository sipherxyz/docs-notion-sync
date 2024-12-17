---
title: Bridging an L1 token to Funki
slug: /tokens/bridging-an-l1-token-to-funki
order: 7.1
description: How to submit ERC-20 tokens for bridging between Ethereum and Funki as a token issuer.
keywords:
  [
    Funki Token List,
    ERC-20 tokens,
    Ethereum,
    Funki Mainnet,
    Funki Bridge,
    token bridging,
    token submission,
    Optimism Superchain,
    token deployment,
    add token to Funki,
  ]
# hide_table_of_contents: true
---

# The Funki Token List

This page is intended for token issuers who already have an ERC-20 contract deployed on Ethereum and would like to submit their token for bridging between Ethereum and Funki and Funki Mainnet to Funki Bridge and other bridges. Funki uses the [Optimism Superchain token list](https://github.com/ethereum-optimism/ethereum-optimism.github.io) as a reference for tokens that have been deployed on Funki.

**_Note - Tokens approved in the Github repository are not necessarily listed on the Funki Bridge._**

**_Disclaimer: Funki does not endorse any of the tokens that are listed in the Github repository and has conducted only preliminary checks, which include automated checks listed_** [**_here_**](https://github.com/ethereum-optimism/ethereum-optimism.github.io)**_._**

---

## Adding your token to the list

The steps below explain how to get your token on the Funki Token List.

### Step 1: Deploy your token on Funki

Select your preferred bridging framework and use it to deploy an ERC-20 for your token on Funki. We recommend you use the framework provided by Funki's [standard bridge](https://github.com/ethereum-optimism/specs/blob/main/specs/protocol/bridges.md) contracts, and furthermore deploy your token using the [OptimismMintableERC20Factory](https://docs.funkichain.com/docs/funki-contracts#funki-l2). Deploying your token on Funki in this manner provides us with guarantees that will smooth the approval process. If you choose a different bridging framework, its interface must be compatible with that of the standard bridge, otherwise it may be difficult for us to support.

### Step 2: Submit details for your token

Follow the instructions in the [GitHub repository](https://github.com/ethereum-optimism/ethereum-optimism.github.io) and submit a PR containing the required details for your token. You must specify in your token's data.json file a section for ‘funki-testnet' and/or 'funki-mainnet'. The change you need to submit is particularly simple if your token has already been added to the Optimism token list.

### Step 3: Await final approval

Tokens approved in the Github repository are not necessarily listed on the Funki Bridge and are not guaranteed or automatic. Funki Bridge reviews are conducted manually by the Funki team.
 <!-- For more information, please visit our [Discord](https://funki.org/discord). -->
