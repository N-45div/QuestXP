"use client";

import { useState, useEffect } from "react";

interface LeaderboardProps {
    onBack: () => void;
    userPoints: number;
    userAddress: string;
}

interface LeaderboardEntry {
    address: string;
    points: number;
    rank: number;
}

// Mock data for the leaderboard
const mockLeaderboardData: LeaderboardEntry[] = [
    { address: "8xyt45...j29d", points: 1250, rank: 1 },
    { address: "3fgh78...k31e", points: 980, rank: 2 },
    { address: "9ikl23...m45f", points: 875, rank: 3 },
    { address: "2opq67...r89g", points: 720, rank: 4 },
    { address: "5stu01...v23h", points: 650, rank: 5 },
    { address: "7wxy45...z67i", points: 540, rank: 6 },
    { address: "1abc89...d01j", points: 490, rank: 7 },
    { address: "4efg23...h45k", points: 430, rank: 8 },
    { address: "6ijk67...l89m", points: 380, rank: 9 },
    { address: "0nop01...q23n", points: 320, rank: 10 },
];

export default function Leaderboard({ onBack, userPoints, userAddress }: LeaderboardProps) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userRank, setUserRank] = useState<number | null>(null);

    useEffect(() => {
        // In a real app, you would fetch this from an API
        // For now, we'll use mock data and insert the user
        const shortenedUserAddress = `${userAddress.slice(0, 4)}...${userAddress.slice(-4)}`;

        // Create a copy of the mock data
        const leaderboardWithUser = [...mockLeaderboardData];

        // Add the current user if they have points
        if (userPoints > 0) {
            // Find where the user would rank
            const userRankIndex = leaderboardWithUser.findIndex(entry => entry.points < userPoints);

            if (userRankIndex === -1) {
                // User has fewer points than everyone on the leaderboard
                if (leaderboardWithUser.length < 10) {
                    leaderboardWithUser.push({
                        address: shortenedUserAddress,
                        points: userPoints,
                        rank: leaderboardWithUser.length + 1
                    });
                    setUserRank(leaderboardWithUser.length);
                }
            } else {
                // Insert user at the correct position
                leaderboardWithUser.splice(userRankIndex, 0, {
                    address: shortenedUserAddress,
                    points: userPoints,
                    rank: userRankIndex + 1
                });

                // Update ranks for all entries
                leaderboardWithUser.forEach((entry, index) => {
                    entry.rank = index + 1;
                });

                setUserRank(userRankIndex + 1);

                // Keep only top 10
                if (leaderboardWithUser.length > 10) {
                    leaderboardWithUser.length = 10;
                }
            }
        }

        setLeaderboard(leaderboardWithUser);
    }, [userPoints, userAddress]);

    const isUserEntry = (address: string) => {
        const shortenedUserAddress = `${userAddress.slice(0, 4)}...${userAddress.slice(-4)}`;
        return address === shortenedUserAddress;
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2>Leaderboard</h2>
                <button
                    onClick={onBack}
                    className="btn btn-secondary"
                >
                    Back to Games
                </button>
            </div>

            <div className="mb-6">
                <p>
                    Top players earn additional token rewards! The top 3 players each week receive bonus airdrops.
                </p>
            </div>

            <div className="card-body">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th style={{ textAlign: 'right' }}>Points</th>
                            <th style={{ textAlign: 'right' }}>Rewards</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((entry) => (
                            <tr
                                key={entry.address}
                                className={isUserEntry(entry.address) ? "user-row" : ""}
                            >
                                <td>
                                    {entry.rank <= 3 ? (
                                        <span className={`rank-badge rank-${entry.rank}`}>
                                            {entry.rank}
                                        </span>
                                    ) : (
                                        <span>{entry.rank}</span>
                                    )}
                                </td>
                                <td>
                                    {isUserEntry(entry.address) ? (
                                        <span className="user-profile-value">{entry.address} (You)</span>
                                    ) : (
                                        entry.address
                                    )}
                                </td>
                                <td style={{ textAlign: 'right' }}>{entry.points}</td>
                                <td style={{ textAlign: 'right' }}>
                                    {entry.rank === 1 ? "50 tokens" :
                                        entry.rank === 2 ? "30 tokens" :
                                            entry.rank === 3 ? "20 tokens" : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {userRank === null || userRank > 10 ? (
                <div className="alert alert-warning mt-6">
                    <p className="user-profile-value">
                        You&apos;re not on the leaderboard yet! Play more games to earn points and climb the ranks.
                    </p>
                    <p className="user-profile-label mt-1">
                        Current points: {userPoints}
                    </p>
                </div>
            ) : null}
        </div>
    );
} 