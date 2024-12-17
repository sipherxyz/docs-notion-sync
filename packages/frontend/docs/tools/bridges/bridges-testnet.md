---
title: Testnet
slug: /tools/bridges/testnet
order: 6.7.3
description: Documentation for bridging assets to the Funki testnet. This page covers how to bridge ETH and ERC-20s between Ethereum testnet and Funki testnet, with essential cautions and contract information.
keywords:
  [
    Funki,
    Funki network,
    bridging,
    bridge to Funki,
    bridge ETH,
    bridge ETH to Funki,
    Funki Bridge,
    Ethereum Sepolia,
    Funki Sepolia,
    ETH,
    ERC-20 tokens,
    Funki Testnet,
    asset bridging,
  ]
# hide_table_of_contents: true
---

# Bridges

---

## Funki Bridge (Testnet)

The [Funki Bridge](https://funkichain.com/bridge) for testnet allows you to bridge ETH and certain ERC-20s from Ethereum Sepolia to Funki Sepolia and vice versa.

To bridge to or from Funki Sepolia:

1. Visit [Funki Bridge](https://funkichain.com/bridge)
2. Click **Connect wallet**
3. Connect your wallet
4. Choose the amount of ETH (or the asset of your choice that's available) you'd like to deposit or withdraw

---

<!-- ## Programmatic Bridging

See the [sample code repository](https://github.com/base-org/guides/tree/main/bridge/native) to see how to bridge ETH and ERC-20s from Ethereum Sepolia to Funki Sepolia. -->

:::caution

**Double check the token address for ERC-20s** You can use any ERC-20 that is
supported on the network. You can check what assets are on Funki Sepolia and the
corresponding contract address via [this hub](https://github.com/ethereum-optimism/ethereum-optimism.github.io/tree/master/data).
<!-- Ensure there is an address for `base-sepolia`, [example](https://github.com/ethereum-optimism/ethereum-optimism.github.io/blob/master/data/WETH/data.json#L19-L21). -->
Always test with small amounts to ensure the system is working as expected.

:::

:::caution
This implementation only can bridge assets to Funki. Do not attempt to alter the
code to withdraw the assets.

:::

---
