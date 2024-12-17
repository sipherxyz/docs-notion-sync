---
title: Mainnet
slug: /tools/bridges/mainnet
order: 6.7.2
description: Documentation for bridging assets to the Funki mainnet. This page covers how to bridge ETH and ERC-20s between Ethereum mainnet and Funki mainnet, with essential cautions and contract information.
keywords:
  [
    Funki,
    Funki network,
    bridging,
    bridge to Funki,
    bridge ETH,
    bridge ETH to Funki,
    Funki Bridge,
    Ethereum Mainnet,
    Funki Mainnet,
    ETH,
    ERC-20 tokens,
    asset bridging,
  ]
# hide_table_of_contents: true
---

# Bridges

---

## Funki Bridge

The [Funki Bridge](https://funkichain.com/bridge) allows you to bridge ETH and certain ERC-20s from Ethereum to Funki and vice versa.

To bridge to or from Funki:

1. Visit [Funki Bridge](https://funkichain.com/bridge)
2. Click **Connect wallet**
3. Connect your wallet
4. Choose the amount of ETH (or the asset of your choice that's available) you'd like to deposit or withdraw

For frequently asked questions about Funki Bridge, be sure to check out the [Bridge FAQ](/docs/tools/bridge-faq/).

---

<!-- ## Programmatic Bridging

See the [sample code repository](https://github.com/funkichain/guides/tree/main/bridge/native) to see how to bridge ETH and ERC-20s from Ethereum to Funki. -->

:::caution


**Double check the token address for ERC-20s** You can use any ERC-20 that is
supported on the network. You can check what assets are on Funki and the
corresponding contract address via [this hub](https://github.com/ethereum-optimism/ethereum-optimism.github.io/tree/master/data).
Always test with small amounts to ensure the system is working as expected.

:::

:::caution

This implementation only can bridge assets to Funki. Do not attempt to alter the
code to withdraw the assets.

:::

---
