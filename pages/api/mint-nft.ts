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
    console.log(transaction[0].data());

    const metadata = (await transaction[0].data()).metadata;

    res.status(200).json(metadata);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}
