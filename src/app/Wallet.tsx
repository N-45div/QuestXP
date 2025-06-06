/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { clusterApiUrl, Connection } from "@solana/web3.js";

// A simple hook to get the wallet's balance in lamports
// const useBalance = () => {
//   const [balance, setBalance] = useState<number>();
//   // The Solana Wallet Adapter hooks
//   const { connection } = useConnection();
//   const { address } = useWallet({ type: "solana" });
//
//   const publicKey = address ? new PublicKey(address) : null;
//
//   if (connection && publicKey) {
//     connection.getBalance(publicKey).then(setBalance);
//   }
//
//   return balance;
// };

// Separate component for the app content that needs access to hooks
const Wallet = () => {
  // Remove the wallet info card UI
  return null;
};

export default Wallet;
