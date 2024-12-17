---
title: Adding tokens to MetaMask
slug: /tokens/adding-tokens-to-metamask
order: 7.2
description: "A simple step by step guide to ensure ERC-20 tokens show immediately on MetaMask once deployed."
keywords:
  [
    "ERC-20",
    "token",
    "memecoin",
    "Funki",
    "MetaMask",
    "build on funki",
    "tokens",
    "token issuer",
    "meme coin",
    "swaps",
  ]
# hide_table_of_contents: true
---

# How to ensure ERC-20 tokens are immediately swappable in MetaMask

This page is intended for developers that will or have recently deployed ERC-20 token contracts on Funki Mainnet and would like their token details to display as quickly as possible on MetaMask.

MetaMask makes any ERC-20 token instantly available for swapping seconds from when the contract is deployed.

Follow the instructions below to ensure your token logo, asset name, and other metadata also appear on MetaMask.

:::info Disclaimer
Funki does not endorse any specific token that is deployed on mainnet and made available for swapping.
:::

---

## Adding your token to the list

The steps below explain how to have your token display quickly on MetaMask. These instructions work not only for Funki, but for any EVM chain supported by MetaMask (Optimism, Arbitrum, Polygon, Avalanche, Fantom, BNB).

### Step 1: Deploy your ERC-20 Token on Funki Mainnet

Write and deploy a compliant ERC-20 token smart contract. Test it and then deploy on Funki Mainnet.

### Step 2: Prepare your metadata and asset images

Prepare a high-resolution images of your token's logo. Ensure it is clear, identifiable, and representative of your token.

### Step 3: List your cryptocurrency on a listing aggregator

You can list for free on Coingecko following these [instructions](https://support.coingecko.com/hc/en-us/articles/7291312302617-How-to-list-new-cryptocurrencies-on-CoinGecko)

You can pay to be listed on CoinMarketCap following these [instructions](https://support.coinmarketcap.com/hc/en-us/articles/360043659351-Listings-Criteria).

Once Coingecko lists your token OR CoinMarketCap lists it as **_verified_**, your asset's image logo and other metadata will flow into MetaMask and can be seen by users.

Remember, once your ERC-20 contract is deployed, your asset is swappable instantly on MetaMask.

:::info Disclaimer
New assets with low liquidity may result in failed swaps or may result in a user receiving less of the destination token due to slippage. An important responsibility of the token creator is to communicate to the community these risks.
:::
