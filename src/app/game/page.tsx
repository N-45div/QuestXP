"use client";

import { useEffect, useState } from "react";
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import Link from "next/link";
import GameHub from "./components/GameHub";
import { useRouter } from "next/navigation";

export default function GamePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasWallet, setHasWallet] = useState(false);
    const userContext = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!userContext.user) {
            router.replace("/");
            return;
        }
        setHasWallet(userHasWallet(userContext));
        setIsLoading(false);
    }, [userContext, router]);

    const createWallet = async () => {
        if (!userHasWallet(userContext)) {
            setIsLoading(true);
            try {
                await userContext.createWallet();
                setHasWallet(true);
            } catch (error) {
                console.error("Failed to create wallet:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p className="mt-4">Loading...</p>
            </div>
        );
    }

    return (
        <div className="main-content container">
            <h1 className="text-center">Civic Play & Earn</h1>

            {!hasWallet ? (
                <div className="card text-center">
                    <p className="mb-4">You need a wallet to play and earn rewards!</p>
                    <button
                        onClick={createWallet}
                        className="btn btn-primary btn-lg"
                    >
                        Create Wallet
                    </button>
                </div>
            ) : (
                <GameHub />
            )}

            <div className="mt-4 text-center">
                <Link href="/" className="footer-link">
                    Back to Home
                </Link>
            </div>
        </div>
    );
} 