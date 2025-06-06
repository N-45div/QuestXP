/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
// import { getSession } from "@civic/auth-web3/nextjs/server";
// TODO: Implement session logic here if needed. The previous import path is not valid in the current version of @civic/auth-web3.

// In-memory storage for points (would use a database in production)
const userPoints: Record<string, number> = {};

export async function GET(request: NextRequest) {
    try {
        return NextResponse.json({ userPoints });
    } catch (error) {
        console.error("Error getting points:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        return NextResponse.json({ received: body });
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
} 