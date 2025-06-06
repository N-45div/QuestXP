"use client";

import { useState, useEffect, useImperativeHandle, forwardRef, useCallback } from "react";
import { Connection, PublicKey } from "@solana/web3.js";

interface UserProfileProps {
    points: number;
    address: string;
}

const UserProfile = forwardRef<{ refreshBalance?: () => Promise<void> } | null, UserProfileProps>(
    function UserProfile({ points, address }, ref) {
        const [balance, setBalance] = useState<number | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [tier, setTier] = useState("Bronze");

        const fetchBalance = useCallback(async () => {
            if (!address) return;
            setIsLoading(true);
            try {
                const connection = new Connection("https://mainnet.helius-rpc.com/?api-key=2d8978c6-7067-459f-ae97-7ea035f1a0cb");
                const publicKey = new PublicKey(address);
                const bal = await connection.getBalance(publicKey);
                setBalance(bal / 1e9); // Convert lamports to SOL
            } catch (error) {
                console.error("Error fetching balance:", error);
            } finally {
                setIsLoading(false);
            }
        }, [address]);

        useImperativeHandle(ref, () => ({
            refreshBalance: fetchBalance
        }));

        useEffect(() => {
            fetchBalance();
        }, [address, fetchBalance]);

        useEffect(() => {
            // Set tier based on points
            if (points >= 1000) {
                setTier("Diamond");
            } else if (points >= 500) {
                setTier("Gold");
            } else if (points >= 100) {
                setTier("Silver");
            } else {
                setTier("Bronze");
            }
        }, [points]);

        const getTierClass = () => {
            switch (tier) {
                case "Diamond":
                    return "tier-diamond";
                case "Gold":
                    return "tier-gold";
                case "Silver":
                    return "tier-silver";
                default:
                    return "tier-bronze";
            }
        };

        const shortenAddress = (addr: string) => {
            if (!addr) return "";
            return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
        };

        return (
            <div className="user-profile">
                <div className="user-profile-section">
                    <div className="user-profile-label">Wallet</div>
                    <div className="user-profile-value">{shortenAddress(address)}</div>
                </div>

                <div className="user-profile-section">
                    <div className="user-profile-label">Balance</div>
                    <div className="user-profile-value">
                        {isLoading ? "Loading..." : `${balance?.toFixed(4)} SOL`}
                    </div>
                </div>

                <div className="user-profile-section">
                    <div className="user-profile-label">Points</div>
                    <div className="user-profile-value">{points}</div>
                </div>

                <div className="user-profile-section">
                    <div className="user-profile-label">Tier</div>
                    <div className={`tier-badge ${getTierClass()}`}>
                        {tier}
                    </div>
                </div>
            </div>
        );
    }
);

export default UserProfile; 