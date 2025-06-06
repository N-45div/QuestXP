/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
// import { getSession } from "@civic/auth-web3/nextjs/server";
// TODO: Implement session logic here if needed. The previous import path is not valid in the current version of @civic/auth-web3.

// In-memory storage for points (would use a database in production)
const userPoints: Record<string, number> = {};

export async function GET(request: NextRequest) {
    try {
        const userId = session.user.id;
        const points = userPoints[userId] || 0;

        return NextResponse.json({ points });
    } catch (error) {
        console.error("Error getting points:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST() {
    try {
        const userId = session.user.id;
        const { points } = await request.json();

        if (typeof points !== "number") {
            return NextResponse.json({ error: "Invalid points value" }, { status: 400 });
        }

        userPoints[userId] = (userPoints[userId] || 0) + points;

        return NextResponse.json({
            points: userPoints[userId],
            message: "Points updated successfully"
        });
    } catch (error) {
        console.error("Error updating points:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 