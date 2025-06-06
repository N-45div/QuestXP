"use client";
import Wallet from "@/app/Wallet";
import { UserButton } from "@civic/auth/react";
import { useUser } from "@civic/auth-web3/react";
import { useEffect, useState } from "react";
import GameHub from "./game/components/GameHub";

export default function Home() {
  const userContext = useUser();
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    if (userContext.user) {
      setShowGame(true);
    } else {
      setShowGame(false);
    }
  }, [userContext.user]);

  return (
    <div className="main-layout">
      <main className="main-content container">
        {showGame ? (
          <>
            <UserButton />
            <Wallet />
            <GameHub />
          </>
        ) : (
          <div className="card mt-6 text-center">
            <h2>QuestXP</h2>
            <p>
              Play fun games, earn points, and get token airdrops! Connect with your Civic Auth wallet and start earning.
            </p>
            <div className="mt-4 flex justify-center">
              <UserButton />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
