# Reddit NFT Drop

Create a seamless user experience for onboarding web2 users into the NFT world, including:

- Creating web3 wallets for users using their email address
- Paying the gas fees for minting NFTs from an admin wallet
- Deploying an NFT Drop onto the Polygon network.

For the full guide, check out our [YouTube video](https://www.youtube.com/watch?v=Qotu4HH7BZ4)

<video src='https://www.youtube.com/watch?v=Qotu4HH7BZ4' width='100%' height='250' controls preload></video>

## Using This Template

Create a copy of this template by running the following command:

```bash
npx thirdweb@latest create --template reddit
```

Set yourself up with a [Magic.Link](https://magic.link/) account, and create a new project.

Add your Magic Link **public** API key to the `.env.local` file:

```text
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=YOUR_API_KEY=xxx
```

In this project, we use environment variables to store our private key [(not recommended)](https://portal.thirdweb.com/sdk/set-up-the-sdk/securing-your-private-key).
Inside `.env.local`, add your private key:

```text
PRIVATE_KEY=xxx
```

## Guide

Below, we'll explore the key areas of this template.

### Setting Up Magic Link Wallet Connector

We use [Magic.Link](https://magic.link/) to create a seamless user experience for onboarding web2 users into the NFT world.

In the [\_app.tsx](/pages/_app.tsx) page, we set up the Magic Link wallet connector in the `ThirdwebProvider`:

```tsx
const magicLinkConnector = new MagicConnector({
  options: {
    apiKey: process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY!,
    rpcUrls: {
      [ChainId.Mumbai]: "https://mumbai.magic.io/rpc",
    },
  },
});

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      desiredChainId={activeChainId}
      walletConnectors={[magicLinkConnector]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
```

Then, on the home page, we use the `useMagic` hook to allow users to connect with magic link:

```tsx
const connectWithMagic = useMagic(); // Hook to connect with Magic Link.
const [email, setEmail] = useState<string>(""); // State to hold the email address the user entered.
```

With an `input` field to enter their email, and a button to connect with Magic Link:

```jsx
<>
  <h2>Login With Email</h2>
  <div>
    <input
      type="email"
      placeholder="Your Email Address"
      onChange={(e) => setEmail(e.target.value)}
    />

    <button
      onClick={() => {
        connectWithMagic({ email });
      }}
    >
      Login
    </button>
  </div>
</>
```

### Minting NFTs.

We mint NFTs from the [NFT Drop](https://portal.thirdweb.com/pre-built-contracts/nft-drop) from the admin wallet in an API route called [mint-nft.ts](/pages/api/mint-nft.ts).

This way, the user never accepts a transaction or needs to pay gas fees:

```tsx
// Boilerplate Nextjs API route with TypeScript
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 1. Grab the address from the request body
    const { address } = req.body;

    // 2. Let's instantiate the thirdweb SDK using our private key.
    const sdk = ThirdwebSDK.fromPrivateKey(
      // Learn more about securely accessing your private key:
      // https://portal.thirdweb.com/sdk/set-up-the-sdk/securing-your-private-key
      process.env.PRIVATE_KEY as string,
      "mumbai" // configure this to your network
    );

    // 2B. Let's connect to our smart contract using it's address
    const contractAddress = "0xBB1B8021e31Ac8A34ba5963e48f65d6a4B43aa42";
    const contract = await sdk.getContract(contractAddress, "nft-drop");

    // 3. Mint an NFT to the address from the NFT drop
    const transaction = await contract.claimTo(address as string, 1);

    // 4. Let's return the transaction info to the client.
    const metadata = (await transaction[0].data()).metadata;

    res.status(200).json(metadata);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
```

We then call this API route on the UI when the user clicks the "Mint NFT" button on the [index.tsx](/pages/index.tsx) page:

```tsx
// 1. Call the mint-nft API Route
const result = await fetch("/api/mint-nft", {
  method: "POST",
  body: JSON.stringify({ address }),
  headers: {
    "Content-Type": "application/json",
  },
});
```

We store the metadata of the NFT in the `mintedNft` state variable when it comes back from the API route:

```tsx
const [mintedNft, setMintedNft] = useState<NFTMetadata | undefined>(undefined);
```

And display it on the UI:

```jsx
<>
  <h2>You&apos;re Connected! 👋</h2> <p>{address}</p>
  <button onClick={() => mintNft()} disabled={loading}>
    {loading ? "Loading..." : "Mint NFT"}
  </button>
  {loading && <p>Loading...</p>}
  {/* Show the minted NFT when it comes back */}
  {mintedNft && (
    <div>
      <h3>Your Minted NFT</h3>
      <ThirdwebNftMedia
        metadata={mintedNft}
        style={{
          width: 300,
        }}
      />
      <p>{mintedNft.name}</p>
    </div>
  )}
</>
```

## Got Questions?

Join our [Discord](https://discord.com/invite/thirdweb) to speak with our team directly.
