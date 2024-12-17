---
title: Connect WalletConnect via AppKit
slug: /tutorials/connect-walletconnect-appkit
order: 5.11
description: ""
---

AppKit offers a comprehensive feature stack, from onboarding to transactions and messaging, enabling apps to create robust, long-lasting web3 experiences through a single, seamless integration.

# **Get Started**

## React

AppKit supports Wagmi and Ethers v6 on Ethereum. Choose one of these Ethereum libraries to begin.

### **Installation**

```tsx
yarn add @web3modal/wagmi wagmi viem @tanstack/react-query
```

### **Cloud Configuration**

Create a new project on WalletConnect Cloud at [https://cloud.walletconnect.com](https://cloud.walletconnect.com/) and obtain your project ID.

### **Implementation**

For quick integration, use the `defaultWagmiConfig` function, which wraps Wagmi's [`createConfig`](https://wagmi.sh/core/api/createConfig) function with a predefined setup. This includes WalletConnect, Coinbase, and Injected connectors, as well as the [Blockchain API](https://docs.walletconnect.com/cloud/blockchain-api) as a [transport](https://wagmi.sh/core/api/createConfig#transports).

Set up the following configuration at the top of your app, ensuring all functions are called **outside** any React component to prevent unwanted rerenders.

```tsx
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = 'YOUR_PROJECT_ID'

// 2. Create wagmiConfig
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum] as const
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

// 3. Create modal
createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
```

### **Trigger the modal**

To open AppKit, you can use our [**web component**](https://docs.walletconnect.com/appkit/react/core/components) or build your own button with AppKit [**hooks**](https://docs.walletconnect.com/appkit/react/core/hooks#useweb3modal). In this example, we'll use the `&lt;w3m-button&gt;` component.

Web components are global HTML elements that don't require importing.

```tsx
export default function ConnectButton() {
  return <w3m-button />
}
```

*Learn more about the AppKit web components [here](https://docs.walletconnect.com/appkit/react/core/components)*

### **Smart Contract Interaction**

Wagmi hooks can help us interact with wallets and smart contracts:

```tsx
import { useReadContract } from 'wagmi'
import { USDTAbi } from '../abi/USDTAbi'

const USDTAddress = '0x...'

function App() {
  const result = useReadContract({
    abi: USDTAbi,
    address: USDTAddress,
    functionName: 'totalSupply'
  })
}
```

*Read more about Wagmi hooks for smart contract interaction [here](https://wagmi.sh/react/hooks/useReadContract).*

---

## Android

Kotlin implementation of AppKit for Android applications.

Android Core

https://img.shields.io/maven-central/v/com.walletconnect/android-core

Web3Modal

https://img.shields.io/maven-central/v/com.walletconnect/web3modal

### **Requirements**

- Android min SDK 23
- Java 11

### **Installation**

`root/build.gradle.kts:`

```tsx
allprojects {
   repositories {
      mavenCentral()
      maven { url "https://jitpack.io" }
   }
}
```

`app/build.gradle.kts`

```tsx
implementation(platform("com.walletconnect:android-bom:$BOM_VERSION"))
implementation("com.walletconnect:android-core")
implementation("com.walletconnect:web3modal")
```

### Implementation

`Web3Modal` is a singleton that interacts with the WalletConnectModal SDK.

**Initialize**

```tsx
val connectionType = ConnectionType.AUTOMATIC or ConnectionType.MANUAL
val projectId = "" // Get Project ID at https://cloud.walletconnect.com/
val appMetaData = Core.Model.AppMetaData(
    name = "Kotlin.Web3Modal",
    description = "Kotlin Web3Modal Implementation",
    url = "kotlin.walletconnect.com",
    icons = listOf("https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Gradient/Icon.png"),
    redirect = "kotlin-web3modal://request"
)

CoreClient.initialize(projectId = projectId, connectionType = connectionType, application = this, metaData = appMetaData)

Web3Modal.initialize(
    init = Modal.Params.Init(CoreClient),
    onSuccess = {
        // Callback will be called if initialization is successful
     },
    onError = { error ->
        // Error will be thrown if there's an issue during initialization
    }
)
```

**Session properties**

You can define session properties by calling the `setSessionProperties` method on the `Web3Modal` object.

**Chains**

This example defines an Ethereum chain. You can specify the chains you want to use, but they must be EVM compatible.

```tsx
// Example of definition chains: https://github.com/WalletConnect/WalletConnectKotlinV2/blob/master/product/web3modal/src/main/kotlin/com/walletconnect/web3/modal/presets/Web3ModalChainsPresets.kt

Web3Modal.setChains(Web3ModalChainsPresets.ethChains.values.toList())
```

***IMPORTANT**: `Chains` must be set before opening the modal.*

### Usage

```tsx
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material.ModalBottomSheetState
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.google.accompanist.navigation.material.BottomSheetNavigator
import com.google.accompanist.navigation.material.ExperimentalMaterialNavigationApi
import com.google.accompanist.navigation.material.ModalBottomSheetLayout
import com.google.accompanist.navigation.material.bottomSheet
import com.walletconnect.web3.modal.ui.web3ModalGraph

setContent {
    val modalSheetState = rememberModalBottomSheetState(initialValue = ModalBottomSheetValue.Hidden, skipHalfExpanded = true)
    val bottomSheetNavigator = BottomSheetNavigator(modalSheetState)
    val navController = rememberNavController(bottomSheetNavigator)

    ModalBottomSheetLayout(bottomSheetNavigator = bottomSheetNavigator) {
        NavHost(
            navController = navController,
            startDestination = "home"
        ) {
            composable("home") {
                HomeScreen()
            }
            web3ModalGraph(navController)
        }
    }
}
```

***IMPORTANT**: Web3Modal uses accompanist navigation material inside. `ModalBottomSheetLayout` should be imported from [Accompanist Navigation Material](https://google.github.io/accompanist/navigation-material/)*

```tsx
import com.walletconnect.web3.modal.ui.openWeb3Modal

navController().openWeb3Modal(
    shouldOpenChooseNetwork = true | false
    onError = {  }
)
```

---

## iOS

### Installation

**Swift Package Manager**

You can add AppKit to your project using Swift Package Manager. Follow these steps:

1. Open Xcode
2. Go to File → Add Packages
3. Paste the GitHub repository URL: https://github.com/WalletConnect/web3modal-swift
4. Click "Add Package"
5. Select the Web3Modal products you want to install in your app

**Alternative: Add Web3Modal to a `Package.swift` manifest**

To integrate via a `Package.swift` manifest instead of Xcode, add Web3Modal to your package's dependencies array:

```tsx
dependencies: [
  .package(
    name: "Web3Modal",
    url: "https://github.com/WalletConnectV2/web3modal-swift.git",
    .upToNextMajor(from: "1.0.13")
  ),

  // Any other dependencies you have...
],
```

Then, in any target that depends on a Web3Modal product, add it to the `dependencies`
array of that target:

```tsx
.target(
  name: "MyTargetName",
  dependencies: [
    // The product(s) you want (most likely Web3Modal).
    .product(name: "Web3Modal", package: "Web3Modal"),
  ]
),
```

### Usage

**Configure Networking and Pair Clients**

Before proceeding, ensure you've properly configured the Networking and Pair Clients.

**Initialize Web3Modal Client**

To initialize the client, simply call the `configure` method from the Web3Modal instance wrapper.

```tsx
let metadata = AppMetadata(
    name: "Example Wallet",
    description: "Wallet description",
    url: "example.wallet",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
    // Used for the Verify: to opt-out verification ignore this parameter
    verifyUrl: "verify.walletconnect.com"
)

Web3Modal.configure(
    projectId: PROJECT_ID,
    metadata: metadata
)
```

This example will default to using following namespaces.

```tsx
let methods: Set<String> = ["eth_sendTransaction", "personal_sign", "eth_signTypedData"]
let events: Set<String> = ["chainChanged", "accountsChanged"]
let blockchains: Set<Blockchain> = [Blockchain("eip155:1")!]
let namespaces: [String: ProposalNamespace] = [
    "eip155": ProposalNamespace(
        chains: blockchains,
        methods: methods,
        events: events
    )
]

let defaultSessionParams =  SessionParams(
                                requiredNamespaces: namespaces,
                                optionalNamespaces: nil,
                                sessionProperties: nil
                            )
```

IIf you want to customize the session parameters, you can call configure and define your own like this:

```tsx
let metadata = AppMetadata(...)

let sessionParams = SessionParams(...)

Web3Modal.configure(
    projectId: PROJECT_ID,
    metadata: metadata,
    sessionParams: sessionParams
)
```

Alternatively, you can modify them later using `Web3Modal.set(sessionParams: SessionParams(...))`

**Provided UI components**

You can now utilize the `Web3ModalButton` or `Web3ModalNetworkButton` components. These components dynamically reflect the Web3Modal client's state, including session status, account address and balance, and the currently selected network. They automatically update when the state changes. For more detailed examples, check out the Sample app's [ContentView.swift](https://github.com/WalletConnect/web3modal-swift/blob/develop/Sample/Example/ContentView.swift).

**Custom UI**

If you want to use a custom UI, you can present the modal by simply calling:

```tsx
Web3Modal.present()
```

This method will traverse the view hierarchy and attempt to present from the topmost controller. It's primarily designed for SwiftUI applications.

Alternatively, you can specify the view controller to present from:

```tsx
Web3Modal.present(from: viewController)
```

**Subscribe to Web3Modal Publishers**

The following publishers are available for subscription:

```tsx
public var sessionPublisher: AnyPublisher<[Session], Never>
public var sessionSettlePublisher: AnyPublisher<Session, Never>
public var sessionRejectionPublisher: AnyPublisher<(Session.Proposal, Reason), Never>
public var sessionDeletePublisher: AnyPublisher<(String, Reason), Never>
public var sessionResponsePublisher: AnyPublisher<Response, Never>
public var socketConnectionStatusPublisher: AnyPublisher<SocketConnectionStatus, Never>
public var authResponsePublisher: AnyPublisher<(id: RPCID, result: Result<(Session?, [Cacao]), AuthError>), Never>
```

**Sign methods**

Web3Modal internally uses the Sign SDK, and most of its methods are exposed through the Web3Modal interface.