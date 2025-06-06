import { NextRequest, NextResponse } from "next/server";
// import { getSession } from "@civic/auth-web3/nextjs/server";
// TODO: Implement session logic here if needed. The previous import path is not valid in the current version of @civic/auth-web3.

// In-memory storage for airdrops (would use a database in production)
const userAirdrops: Record<string, { lastAirdropTimestamp: number, totalAirdropped: number }> = {};

// Airdrop tiers
const AIRDROP_TIERS = [
    { points: 100, tokens: 5 },
    { points: 500, tokens: 30 },
    { points: 1000, tokens: 100 },
];

export async function POST(request: NextRequest) {
    try {
        // const session = await getSession();

        const userId = session.user.id;
        const { points, walletAddress } = await request.json();

        if (typeof points !== "number" || !walletAddress) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        // Check if user has received an airdrop in the last 24 hours
        const now = Date.now();
        const lastAirdrop = userAirdrops[userId]?.lastAirdropTimestamp || 0;
        const hoursSinceLastAirdrop = (now - lastAirdrop) / (1000 * 60 * 60);

        if (hoursSinceLastAirdrop < 24) {
            return NextResponse.json({
                error: "Airdrop limit reached",
                message: "You can request an airdrop once every 24 hours",
                nextAirdropAvailable: new Date(lastAirdrop + 24 * 60 * 60 * 1000).toISOString()
            }, { status: 429 });
        }

        // Determine token amount based on points
        let tokensToAirdrop = 0;
        for (const tier of AIRDROP_TIERS) {
            if (points >= tier.points) {
                tokensToAirdrop = tier.tokens;
            } else {
                break;
            }
        }

        if (tokensToAirdrop === 0) {
            return NextResponse.json({
                error: "Insufficient points",
                message: "You need at least 100 points to receive an airdrop"
            }, { status: 400 });
        }

        // In a real implementation, this would transfer actual tokens
        // For this demo, we'll simulate a successful airdrop

        // Update airdrop record
        userAirdrops[userId] = {
            lastAirdropTimestamp: now,
            totalAirdropped: (userAirdrops[userId]?.totalAirdropped || 0) + tokensToAirdrop
        };

        return NextResponse.json({
            success: true,
            tokensAirdropped: tokensToAirdrop,
            totalAirdropped: userAirdrops[userId].totalAirdropped,
            message: `Successfully airdropped ${tokensToAirdrop} tokens to your wallet!`
        });

    } catch (error) {
        console.error("Error processing airdrop:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 