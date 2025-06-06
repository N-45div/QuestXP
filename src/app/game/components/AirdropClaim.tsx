"use client";

import { useState } from "react";
import { useWallet } from "@civic/auth-web3/react";

interface AirdropClaimProps {
    points: number;
}

export default function AirdropClaim({ points }: AirdropClaimProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        success?: boolean;
        message?: string;
        error?: string;
        tokensAirdropped?: number;
    } | null>(null);
    const { address } = useWallet({ type: "solana" });

    const getEligibleAmount = () => {
        if (points >= 1000) return 100;
        if (points >= 500) return 30;
        if (points >= 100) return 5;
        return 0;
    };

    const eligibleAmount = getEligibleAmount();
    const isEligible = eligibleAmount > 0;

    const handleClaim = async () => {
        if (!address || !isEligible) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/airdrop", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    points,
                    walletAddress: address,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult({
                    success: true,
                    message: data.message,
                    tokensAirdropped: data.tokensAirdropped,
                });
            } else {
                setResult({
                    success: false,
                    error: data.message || data.error || "Failed to claim airdrop",
                });
            }
        } catch (error) {
            setResult({
                success: false,
                error: "An error occurred while claiming your airdrop",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="mb-4">Token Airdrop</h3>

            <div className="mb-6">
                <div className="flex justify-between mb-2">
                    <span>Your Points:</span>
                    <span className="user-profile-value">{points}</span>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${Math.min((points / 1000) * 100, 100)}%`,
                        }}
                    ></div>
                </div>

                <div className="progress-markers">
                    <span>0</span>
                    <span>100</span>
                    <span>500</span>
                    <span>1000</span>
                </div>
            </div>

            {isEligible ? (
                <div className="alert alert-success mb-6">
                    <p>
                        You&apos;re eligible for a <span className="user-profile-value">{eligibleAmount} token</span> airdrop!
                    </p>
                </div>
            ) : (
                <div className="alert alert-warning mb-6">
                    <p>
                        Earn at least 100 points to be eligible for a token airdrop.
                    </p>
                </div>
            )}

            {result && (
                <div
                    className={`alert ${result.success ? "alert-success" : "alert-error"} mb-6`}
                >
                    <p className="user-profile-value">
                        {result.success
                            ? `Success! ${result.tokensAirdropped} tokens have been airdropped to your wallet.`
                            : result.error}
                    </p>
                </div>
            )}

            <button
                onClick={handleClaim}
                disabled={!isEligible || isLoading}
                className={isEligible && !isLoading ? "btn btn-primary btn-block" : "btn btn-secondary btn-block"}
            >
                {isLoading ? "Processing..." : "Claim Airdrop"}
            </button>

            <div className="mt-4 user-profile-label">
                <p>
                    Airdrops are limited to once every 24 hours. Tokens will be sent directly to your embedded wallet.
                </p>
            </div>
        </div>
    );
} 
