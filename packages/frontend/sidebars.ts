import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docSidebar: [
  "overview",
  "the-dokodemo-protocol",
  "using-funki",
  {
    type: "category",
    label: "Building On Funki",
    collapsed: false,
    collapsible: false,
    items: [
      "building-on-funki/network-information",
      "building-on-funki/funki-contracts",
      "building-on-funki/fees",
      "building-on-funki/differences"
    ]
  },
  {
    type: "category",
    label: "Tutorials",
    collapsed: false,
    collapsible: false,
    items: [
      "tutorials/deploy-sm-using-hardhat",
      "tutorials/deploy-sm-using-foundry",
      "tutorials/deploy-sm-using-remix",
      "tutorials/deploy-sm-using-thirdweb",
      "tutorials/building-onchain-app-thirdweb",
      "tutorials/verify-sm-on-funkichain",
      "tutorials/simple-nfts",
      "tutorials/simple-fungible-tokens",
      "tutorials/interact-with-standard-bridge",
      "tutorials/connect-metamask",
      "tutorials/connect-walletconnect-appkit",
      "tutorials/my-tutorial-1"
    ]
  },
  {
    type: "category",
    label: "Tools",
    collapsed: false,
    collapsible: false,
    items: [
      "tools/block-explorers",
      "tools/node-providers",
      "tools/network-faucets",
      "tools/cross-chain",
      {
        type: "category",
        label: "Dexs",
        collapsible: true,
        collapsed: true,
        items: [
          "tools/dexs/funki-dex",
          "tools/dexs/funki-dex-faq"
        ]
      },
      "tools/onramps",
      {
        type: "category",
        label: "Bridges",
        collapsible: true,
        collapsed: true,
        items: [
          "tools/bridges/bridges-faq",
          "tools/bridges/bridges-mainnet",
          "tools/bridges/bridges-testnet"
        ]
      },
      {
        type: "category",
        label: "Toolchains",
        collapsible: true,
        collapsed: true,
        items: [
          "tools/toolchains/hardhat",
          "tools/toolchains/foundry",
          "tools/toolchains/thirdweb-cli"
        ]
      },
      {
        type: "category",
        label: "Clients",
        collapsible: true,
        collapsed: true,
        items: [
          "tools/clients/ethers",
          "tools/clients/thirdweb-sdk",
          "tools/clients/viem",
          "tools/clients/web3"
        ]
      }
    ]
  },
  {
    type: "category",
    label: "Tokens",
    collapsed: false,
    collapsible: false,
    items: [
      "tokens/token-list",
      "tokens/wallet"
    ]
  },
  "security",
  "my-tutorial-2",
  "privacy-policy",
  "terms-of-use"
]
};

export default sidebars;