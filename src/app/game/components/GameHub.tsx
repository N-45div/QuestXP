"use client";

import { useState, useRef } from "react";
import { useWallet, useUser } from "@civic/auth-web3/react";
import MemoryGame from "./MemoryGame";
import QuizGame from "./QuizGame";
import UserProfile from "./UserProfile";
import Leaderboard from "./Leaderboard";
import AirdropClaim from "./AirdropClaim";
import { payEntryFee, MAINNET_CONNECTION } from "./entryFee";
import { userHasWallet } from "@civic/auth-web3";

const games = [
    {
        id: "memory",
        name: "Memory Match",
        description: "Match pairs of cards to earn points",
        component: MemoryGame,
        pointsPerWin: 10,
    },
    {
        id: "quiz",
        name: "Crypto Quiz",
        description: "Test your crypto knowledge and earn points",
        component: QuizGame,
        pointsPerWin: 15,
    },
];

const ENTRY_FEE_SOL = 0.01;
const ENTRY_FEE_LAMPORTS = Math.floor(ENTRY_FEE_SOL * 1e9);
const connection = MAINNET_CONNECTION;

export default function GameHub() {
    const [activeGame, setActiveGame] = useState<string | null>(null);
    const [userPoints, setUserPoints] = useState(0);
    const { address } = useWallet({ type: "solana" });
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showAirdropClaim, setShowAirdropClaim] = useState(false);
    const userContext = useUser();
    const [entryFeeLoadingGameId, setEntryFeeLoadingGameId] = useState<string | null>(null);
    const [entryFeeError, setEntryFeeError] = useState("");
    const userProfileRef = useRef(null);

    const handleGameComplete = (points: number) => {
        setUserPoints((prev) => prev + points);
        setActiveGame(null);
    };

    async function handleStartGame(gameId) {
        setEntryFeeError("");
        if (!userHasWallet(userContext)) {
            setEntryFeeError("Connect your wallet first!");
            return;
        }
        setEntryFeeLoadingGameId(gameId);
        try {
            await payEntryFee(
                userContext.solana.wallet,
                userContext.solana.address,
                connection,
                ENTRY_FEE_LAMPORTS
            );
            if (userProfileRef.current && userProfileRef.current.refreshBalance) {
                await userProfileRef.current.refreshBalance();
            }
            setActiveGame(gameId);
        } catch (err) {
            setEntryFeeError("Entry fee payment failed: " + (err.message || err));
        } finally {
            setEntryFeeLoadingGameId(null);
        }
    }

    const renderActiveGame = () => {
        if (!activeGame) return null;

        const game = games.find((g) => g.id === activeGame);
        if (!game) return null;

        const GameComponent = game.component;
        return (
            <GameComponent
                onComplete={(success: boolean) =>
                    handleGameComplete(success ? game.pointsPerWin : 0)
                }
                onExit={() => setActiveGame(null)}
            />
        );
    };

    if (showLeaderboard) {
        return (
            <div className="game-container">
                <Leaderboard
                    onBack={() => setShowLeaderboard(false)}
                    userPoints={userPoints}
                    userAddress={address || ""}
                />
            </div>
        );
    }

    if (showAirdropClaim) {
        return (
            <div className="game-container">
                <div className="mb-4">
                    <button
                        onClick={() => setShowAirdropClaim(false)}
                        className="btn btn-secondary"
                    >
                        Back to Games
                    </button>
                </div>
                <AirdropClaim points={userPoints} />
            </div>
        );
    }

    return (
        <div className="game-container">
            <div className="card-header mb-8">
                <UserProfile ref={userProfileRef} points={userPoints} address={address || ""} />
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowAirdropClaim(true)}
                        className="btn btn-success"
                    >
                        Claim Tokens
                    </button>
                    <button
                        onClick={() => setShowLeaderboard(true)}
                        className="btn btn-primary"
                    >
                        Leaderboard
                    </button>
                </div>
            </div>

            {activeGame ? (
                renderActiveGame()
            ) : (
                <div className="game-grid">
                    {games.map((game) => (
                        <div
                            key={game.id}
                            className="game-card game-card-large"
                            onClick={() => handleStartGame(game.id)}
                        >
                            <h3>{game.name}</h3>
                            <p className="mb-4">{game.description}</p>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                                <span className="tier-badge tier-bronze mr-0 md:mr-4 mb-2 md:mb-0">
                                    {game.pointsPerWin} points per win
                                </span>
                                <button
                                    className="btn btn-primary btn-lg"
                                    disabled={entryFeeLoadingGameId === game.id}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        await handleStartGame(game.id);
                                    }}
                                    style={{ minWidth: 140 }}
                                >
                                    {entryFeeLoadingGameId === game.id ? "Processing..." : `Play (Entry: 0.01 SOL)`}
                                </button>
                            </div>
                            {entryFeeError && entryFeeLoadingGameId === game.id && (
                                <div className="alert alert-error mt-2">{entryFeeError}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="card mt-8 alert alert-warning">
                <h3 className="mb-2">How to Earn Tokens</h3>
                <p>
                    Earn points by playing games and completing challenges. Once you reach certain
                    point thresholds, you&apos;ll be eligible for token airdrops. Leaderboard positions
                    also qualify for bonus rewards!
                </p>
                <div className="flex justify-between mt-4">
                    <div className="card">
                        <div className="user-profile-value">100 points</div>
                        <div className="user-profile-label">5 tokens</div>
                    </div>
                    <div className="card">
                        <div className="user-profile-value">500 points</div>
                        <div className="user-profile-label">30 tokens</div>
                    </div>
                    <div className="card">
                        <div className="user-profile-value">1000 points</div>
                        <div className="user-profile-label">100 tokens</div>
                    </div>
                </div>
            </div>
        </div>
    );
} 