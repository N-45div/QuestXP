/* eslint-disable react/no-unescaped-entities */
import { SolanaWallet } from "@civic/auth-web3";
import { Connection, PublicKey, PublicKeyInitData, SystemProgram, Transaction } from "@solana/web3.js";

export const GAME_TREASURY_ADDRESS = "DHw7Je34SmMGT7GcSdkKHBfjCbYaFoYKa2yxKKwPvYdW";

export async function payEntryFee(wallet: SolanaWallet, userAddress: PublicKeyInitData, connection: Connection, feeLamports: number) {
    const treasuryPubkey = new PublicKey(GAME_TREASURY_ADDRESS);
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: new PublicKey(userAddress),
            toPubkey: treasuryPubkey,
            lamports: feeLamports,
        })
    );
    return wallet.sendTransaction(transaction, connection);
}

export const MAINNET_CONNECTION = new Connection(`https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_KEY}`);