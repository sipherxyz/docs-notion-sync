---
title: Simple NFTs
slug: /tutorials/simple-nfts
order: 5.7
description: ""
--- 

NFTs often utilize off-chain storage for metadata and images. Some employ immutable solutions like [IPFS](https://ipfs.tech/), while others use traditional web hosting. The latter may allow contract owners to modify asset URLs, which, while useful for troubleshooting, introduces a trust requirement for users.

---

## Objectives

By the end of this tutorial, you'll learn how to:

- Generate and return JSON metadata for ERC-721 tokens programmatically
- Create unique SVG art deterministically within a smart contract
- Produce deterministic, pseudorandom numbers

---

## Prerequisites

### ERC-721 Tokens

This tutorial assumes you can write, test, and deploy [ERC-721](https://docs.openzeppelin.com/contracts/4.x/erc721) tokens using Solidity. If you need to brush up on these skills first, check out some introductory resources.

### Vector Art

You'll need familiarity with the SVG format and basic skills in editing and manipulating vector art. Don't have these? No worries—grab an artsy friend and team up!!

---

## Building Smart Contract

Begin by setting up an OpenZeppelin ERC-721 contract. You'll need to create a `mintTo` function that accepts the recipient's address for the NFT.

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RandomColorNFT is ERC721 {
    uint public counter;

    constructor() ERC721("RandomColorNFT", "RCNFT") {}

    function mintTo(address _to) public {
        counter++;
        _safeMint(_to, counter);
    }
}
```

> When using Smart Wallet, `msg.sender` represents the user's custodial address—the intended NFT recipient. However, this isn't always true with account abstraction. In some implementations, `msg.sender` might be the smart contract address, even if the user signs in with an EOA. As a result, it's becoming standard practice to explicitly pass the desired NFT recipient's address.
>

## Offchain Metadata
[](#onchain-metadata)

> You can skip this section if you prefer to make your metadata fully on-chain.
> 

This approach enables the smart contract to retrieve NFT metadata via an API server URL. You have the flexibility to deploy your metadata API on various platforms: IPFS, cloud storage, or your own servers.

For reference, sample API servers are available in both [Python](https://github.com/ProjectOpenSea/metadata-api-python) and [NodeJS](https://github.com/ProjectOpenSea/metadata-api-nodejs).

Essentially, we'll configure the tokenURI function to return a result like this:

![image.png](/img/tokenURI-config.png)

In this example, the API is a public endpoint that returns JSON data as follows:

```json
// 20240823144509
// https://api-dashboard.atherlabs.xyz/api/sipher/loyalty/uri/erc721/INU/123

{
  "name": "Sipher INU #8234",
  "attributes": [
    {
      "trait_type": "background",
      "value": "blue smoke"
    },
    {
      "trait_type": "costume",
      "value": "sheriff jacket"
    },
    {
      "trait_type": "eye color",
      "value": "green"
    },
    {
      "trait_type": "fur color",
      "value": "brown"
    },
    {
      "trait_type": "hand",
      "value": "spike glove"
    },
    {
      "trait_type": "mask",
      "value": "gas mask"
    },
    {
      "trait_type": "secondary background color",
      "value": "pink"
    },
    {
      "trait_type": "sub-race",
      "value": "Canis"
    },
    {
      "trait_type": "weapon",
      "value": "metal pipe"
    }
  ],
  "description": "",
  "external_url": "https://playsipher.com",
  "image": "https://sipherstorage.s3.ap-southeast-1.amazonaws.com/imgs/shiba_008234_mask.png"
}
```

To implement this, override the `_baseURI()` function to return your API URL. In this example, we override it to return the `baseURI` variable:

```solidity
function _baseURI() internal view override returns (string memory) {
    return baseURI;
}
```

You can set your `baseURI` in the constructor or create a `setBaseURI()` function for easy updates:

```solidity
function setBaseURI(string calldata _uri) external onlyRole(MANAGER_ROLE) {
    baseURI = _uri;
}
```

With this setup, the OpenZeppelin library's `tokenURI()` function will automatically combine your API URL with the input tokenId, creating a complete API call:

```solidity
function tokenURI(uint256 tokenId) public view virtual returns (string memory) {
    _requireOwned(tokenId);

    string memory baseURI = _baseURI();
    return bytes(baseURI).length > 0 ? string.concat(baseURI, tokenId.toString()) : "";
}
```

By managing your API's output, you can provide unique metadata for each NFT tokenId.

## Onchain Metadata[](#onchain-metadata)

> Skip this section if you've already implemented your metadata off-chain.
> 

Instead of referencing a `json` file hosted on a traditional web server, you can store your metadata directly in the contract. To implement this, first import these helper libraries:

```
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
```

Then, `override` the `_baseURI` and `tokenURI` functions to return Base64-encoded JSON metadata containing the relevant information:

```solidity
function _baseURI() internal pure override returns (string memory) {
  return "data:application/json;base64,";
}

function tokenURI(uint _tokenId) public view override returns (string memory) {
  if(_tokenId > counter) {
    revert InvalidTokenId(_tokenId);
  }

  string memory json = Base64.encode(
    bytes(
      string(
        abi.encodePacked(
        '{"name": "',
        name(),
        ' #: ',
        Strings.toString(_tokenId),
        '","description": "Random colors are pretty or boring!", "image": "image": "data:image/svg+xml;base64,',
        // TODO...,
        '"}'
        )
      )
    )
  );

  return string(abi.encodePacked(_baseURI(), json));
}
```

**Exercise extreme caution** when setting up the single and double quotes above. Always test this function thoroughly to ensure it produces valid JSON metadata. A single error here can break the NFT, preventing it from displaying correctly in wallets or marketplaces!

### Onchain SVG Image

The NFT's art will feature a simple SVG containing a square with a pseudo-randomly chosen color, all stored directly on the blockchain.

Let's start by creating a `render` function:

```solidity
function render(uint _tokenId) public view returns (string memory) {
  return string(
    abi.encodePacked(
      "&lt;svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'&gt;",
        // TODO: add a rectangle with a random color fill
      "&lt;/svg&gt;"
    )
  );
}
```

In SVG, rectangles are created using the [rect] element. To fill the entire background, set the width and height to match the `viewbox` dimensions. While not explicitly mentioned in the MDN documentation for rectangles, you can use the `fill` property to add color to any SVG element. Color can be specified using names or hex codes:

```html
<rect width="100" height="100" fill="#aabbcc" />

```

### Generating a Random Color

Instead of a fixed color, your design requires a unique color for each NFT. Add a function to generate this:

```solidity
// Function to generate a random color hex code
function generateRandomColor() public view returns (string memory) {
  // Generate a pseudo-random number using block.prevrandao
  uint256 randomNum = uint256(keccak256(abi.encodePacked(block.prevrandao, block.timestamp, msg.sender)));

  // Extract RGB components from the random number
  bytes memory colorBytes = new bytes(3);
  colorBytes[0] = bytes1(uint8(randomNum >> 16));
  colorBytes[1] = bytes1(uint8(randomNum >> 8));
  colorBytes[2] = bytes1(uint8(randomNum));

  // Convert RGB components to hex string
  string memory colorHex = string(abi.encodePacked(
    "#",
    toHexDigit(uint8(colorBytes[0]) >> 4),
    toHexDigit(uint8(colorBytes[0]) & 0x0f),
    toHexDigit(uint8(colorBytes[1]) >> 4),
    toHexDigit(uint8(colorBytes[1]) & 0x0f),
    toHexDigit(uint8(colorBytes[2]) >> 4),
    toHexDigit(uint8(colorBytes[2]) & 0x0f)
  ));

  return colorHex;
}

// Helper function to convert a uint8 to a hex character
function toHexDigit(uint8 d) internal pure returns (bytes1) {
  if (d < 10) {
    return bytes1(uint8(bytes1('0')) + d);
  } else {
    return bytes1(uint8(bytes1('a')) + d - 10);
  }
}
```

> Caution: Randomness generated using on-chain information isn't fully secure. A determined attacker could manipulate a block to compromise your contract. That said, `prevrandao` is a passable solution for non-high-stakes applications.
> 

### Saving the Color to the NFT

To associate each NFT with its generated color, you'll need to store this information for retrieval when the `tokenURI` function is called. Add a mapping to establish this relationship:

```solidity
mapping (uint => string) public tokenIdToColor;
```

Then, set the color during the minting process:

```solidity
function mintTo(address _to) public {
    counter++;
    _safeMint(_to, counter);
    tokenIdToColor[counter] = generateRandomColor();
}
```

### Completing the `tokenURI` Function

Update your `render` function to generate the SVG:

```solidity
function render(uint _tokenId) public view returns (string memory) {
    return string(
        abi.encodePacked(
            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024'>",
            "<rect width='1024' height='1024' fill='",
            tokenIdToColor[_tokenId],
            "' />",
            "</svg>"
        )
    );
}
```

Finally, modify your `tokenURI` function to incorporate the SVG and return it as base64-encoded data:

```solidity
function tokenURI(uint _tokenId) public view override returns (string memory) {
  if(_tokenId > counter) {
    revert InvalidTokenId(_tokenId);
  }

  string memory json = Base64.encode(
    bytes(
      string(
        abi.encodePacked(
        '{"name": "',
        name(),
        ' #: ',
        Strings.toString(_tokenId),
        '","description": "Random colors are pretty or boring!", "image": "data:image/svg+xml;base64,',
        Base64.encode(bytes(render(_tokenId))),
        '"}'
        )
      )
    )
  );

  return string(abi.encodePacked(_baseURI(), json));
}

```

## List of NFTs Owned

Standard ERC-721 contracts don't provide a built-in way to list all NFTs owned by an address. This is due to gas costs, as the data is typically accessed through off-chain services.

However, recent gas price reductions make on-contract ownership tracking more feasible, potentially reducing reliance on external APIs.

To track ownership in-contract, start by importing `EnumerableSet` from OpenZeppelin:

```solidity
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
```

Next, enable it for `uint` sets and add a mapping to link `addresses` to token IDs:

```solidity
// Inside the RandomColorNFT contract
using EnumerableSet for EnumerableSet.UintSet;

mapping (address => EnumerableSet.UintSet) tokensOwned;
```

Lastly, use the `_update` function to handle ownership changes, including minting:

```solidity
function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns(address) {
  // Only remove the token if it is not being minted
  if (tokenId != counter){
    tokensOwned[auth].remove(tokenId);
  }
  tokensOwned[to].add(tokenId);

  return super._update(to, tokenId, auth);
}
```

With this list of NFTs owned by an address, you can now create a function to retrieve them all. Include the JSON metadata for each token to get the complete list of NFTs **and** their metadata in a single RPC call!

```solidity
function getNFftsOwned(address owner) public view returns (TokenAndMetatdata[] memory) {
  TokenAndMetatdata[] memory tokens = new TokenAndMetatdata[](tokensOwned[owner].length());
  for (uint i = 0; i < tokensOwned[owner].length(); i++) {
    uint tokenId = tokensOwned[owner].at(i);
    tokens[i] = TokenAndMetatdata(tokenId, tokenURI(tokenId));
  }
  return tokens;
}

```

## Testing[](#testing)

Test your contract locally, then deploy and verify it. Ensure proper formatting of JSON metadata and SVG image. To confirm functionality, check the collection on a testnet NFT marketplace.

Note: Collection registration may take a few minutes. If display issues occur, use a blockchain explorer to retrieve the `tokenURI`, then decode the base64 data to inspect the metadata and image.

## Deploy Contract

To deploy the contract, you can refer to our tutorials that suit your preferred tech stack:

- Deploying a smart contract using Foundry
- Deploying a smart contract using Hardhat
- Deploying a smart contract using Remix

## Conclusion[](#conclusion)

This tutorial has equipped you with the skills to create a simple yet powerful NFT (Non-Fungible Token) with both off-chain and on-chain metadata. You've learned to generate and return JSON metadata for ERC-721 tokens programmatically, craft unique SVG art deterministically within a smart contract, and produce pseudorandom numbers for color generation. This knowledge forms a solid foundation for developing more sophisticated NFT projects and understanding the intricacies of on-chain data storage in blockchain applications.
