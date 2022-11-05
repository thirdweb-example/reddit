import { ThirdwebNftMedia, useAddress } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { useMagic } from "@thirdweb-dev/react/evm/connectors/magic";
import { NFTMetadata } from "@thirdweb-dev/sdk";

const Home: NextPage = () => {
  const connectWithMagic = useMagic(); // Hook to connect with Magic Link.
  const [email, setEmail] = useState<string>(""); // State to hold the email address the user entered.
  const address = useAddress(); // Hook to grab the currently connected user's address.
  const [loading, setLoading] = useState<boolean>(false); // State to hold the loading state of the button.
  const [mintedNft, setMintedNft] = useState<NFTMetadata | undefined>(
    undefined
  );

  async function mintNft() {
    setLoading(true);

    try {
      // 1. Call the mint-nft API Route
      const result = await fetch("/api/mint-nft", {
        method: "POST",
        body: JSON.stringify({ address }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Grab the json returned out of the API
      const mintedNftMetadata = await result.json();
      console.log(mintedNftMetadata);

      setMintedNft(mintedNftMetadata as NFTMetadata);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }

    // Wait til the transaction on that API route is complete and result is sent back to us
    // Show that information on the UI
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {address ? (
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
        ) : (
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
        )}
      </main>
    </div>
  );
};

export default Home;
