---
title: Foundry
slug: /tools/toolchains/foundry
order: 6.8.2
description: Documentation for Foundry, a toolchain for smart contract development. Provides instructions on deploying and verifying contracts on Funki's mainnet and testnet using Foundry.
keywords:
  [
    Foundry,
    Forge,
    Foundry Book,
    smart contract development,
    toolchain,
    Funki,
    Funki mainnet,
    Funki testnet,
    Funki network,
    RPC URL,
    chain id,
    deploying contracts,
    verifying contracts,
    mainnet,
    testnet,
  ]
# hide_table_of_contents: true
---

# Foundry

Foundry is a smart contract development toolchain.

With Foundry you can manage your dependencies, compile your project, run tests, deploy smart contracts, and interact with the chain from the command-line and via Solidity scripts.

Check out the [Foundry Book](https://book.getfoundry.sh/) to get started with using Foundry with Funki.

---

# Using Foundry with Funki

Foundry supports Funki out-of-the-box.

Just provide the Funki RPC URL and Chain ID when deploying and verifying your contracts.

## Mainnet

### Deploying a smart contract

```bash
forge create ... --rpc-url=`https://rpc-mainnet.funkichain.com`/
```

### Verifying a smart contract

```bash
forge verify-contract ... --chain-id 33979
```

## Testnet

### Deploying a smart contract

```bash
forge create ... --rpc-url=https://funki-testnet.alt.technology
```

### Verifying a smart contract

```bash
forge verify-contract ... --chain-id 3397901
```
