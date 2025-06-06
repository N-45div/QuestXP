"use client";

import { useState } from "react";
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import { PublicKey, SystemProgram, Transaction, Connection } from "@solana/web3.js";

export default function SendTransaction() {
    const userContext = useUser();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("");
    const [txSig, setTxSig] = useState("");

    // Only show the form if the user has a wallet
    if (!userHasWallet(userContext)) {
        return (
            <div className="card mt-6 text-center">
                <h3 className="mb-4">Send SOL</h3>
                <div className="mb-4">Connect your wallet to send SOL.</div>
            </div>
        );
    }

    const publicKey = userContext.solana.address;
    const wallet = userContext.solana.wallet;
    const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=2d8978c6-7067-459f-ae97-7ea035f1a0cb");

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("");
        setTxSig("");

        try {
            if (!publicKey || !wallet) {
                setStatus("Wallet not connected.");
                return;
            }
            const recipientKey = new PublicKey(recipient);
            const lamports = Math.floor(Number(amount) * 1e9);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: new PublicKey(publicKey),
                    toPubkey: recipientKey,
                    lamports,
                })
            );

            setStatus("Sending transaction...");
            const signature = await wallet.sendTransaction(transaction, connection);
            setTxSig(signature);
            setStatus("Transaction sent!");
        } catch (err: any) {
            setStatus("Error: " + err.message);
        }
    };

    return (
        <div className="card mt-6">
            <h3 className="mb-4">Send SOL</h3>
            <form onSubmit={handleSend} className="flex flex-col gap-4">
                <input
                    className="form-control"
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    required
                />
                <input
                    className="form-control"
                    type="number"
                    min="0"
                    step="0.0001"
                    placeholder="Amount (SOL)"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                />
                <button className="btn btn-primary" type="submit">
                    Send
                </button>
            </form>
            {status && <div className="mt-4">{status}</div>}
            {txSig && (
                <div className="mt-2">
                    <a
                        href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        View on Solana Explorer
                    </a>
                </div>
            )}
            <div className="mt-2 text-xs text-gray-400">
                Powered by <a href="https://docs.civic.com/auth/web3/solana#using-the-wallet" target="_blank" rel="noopener noreferrer">Civic Auth</a>
            </div>
        </div>
    );
} 