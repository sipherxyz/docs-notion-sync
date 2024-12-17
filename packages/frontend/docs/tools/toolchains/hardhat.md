---
title: Hardhat
slug: /tools/toolchains/hardhat
order: 6.8.1
description: Documentation for configuring Hardhat for smart contract development on Funki, including setup instructions for mainnet, testnet, and local development environments.
keywords:
  [
    Hardhat,
    Funki,
    Funki network,
    Funki mainnet,
    Funki testnet,
    hardhat config,
    hardhat configuration,
    Ethereum development,
    smart contract,
    deployment,
    mainnet,
    testnet,
    local development,
  ]
# hide_table_of_contents: true
---

# Hardhat

Hardhat is an Ethereum development environment for flexible, extensible, and fast smart contract development.

You can use Hardhat to edit, compile, debug, and deploy your smart contracts to Funki.

---

# Using Hardhat with Funki

To configure [Hardhat](https://hardhat.org/) to deploy smart contracts to Funki, update your project’s `hardhat.config.ts` file by adding Funki as a network:

```typescript
networks: {
   // for mainnet
   "funki-mainnet": {
     url: 'https://rpc-mainnet.funkichain.com',
     accounts: [process.env.PRIVATE_KEY as string],
     gasPrice: 1000000000,
   },
   // for Sepolia testnet
   "funki-sepolia": {
     url: "https://sepolia-sandbox.funkichain.com/",
     accounts: [process.env.PRIVATE_KEY as string]
     gasPrice: 1000000000,
   },
   // for local dev environment
   "funki-local": {
     url: "http://localhost:8545",
     accounts: [process.env.PRIVATE_KEY as string],
     gasPrice: 1000000000,
   },
 },
 defaultNetwork: "funki-local",
```

<!-- :::info

For a complete guide on using Hardhat to deploy contracts on Funki, see [Deploying a Smart Contract](/guides/deploy-smart-contracts).

::: -->

---
