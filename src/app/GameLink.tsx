"use client";

import Link from "next/link";

export default function GameLink() {
    return (
        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-3">QuestXP</h2>
            <p className="mb-4">
                Play fun games, earn points, and get token airdrops! Connect with your Civic Auth wallet and start earning.
            </p>
            <Link href="/game" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Start Playing
            </Link>
        </div>
    );
} 