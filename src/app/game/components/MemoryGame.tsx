"use client";

import { useState, useEffect, useCallback } from "react";

interface MemoryGameProps {
    onComplete: (success: boolean) => void;
    onExit: () => void;
}

interface Card {
    id: number;
    type: string;
    flipped: boolean;
    matched: boolean;
}

const cardTypes = [
    "🔑", // Key (wallet)
    "💎", // Diamond (valuable asset)
    "🪙", // Coin
    "📊", // Chart
    "🔒", // Lock (security)
    "🌐", // Globe (web3)
    "🧩", // Puzzle piece (blockchain)
    "💻", // Computer
];

export default function MemoryGame({ onComplete, onExit }: MemoryGameProps) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedPairs, setMatchedPairs] = useState<number>(0);
    const [moves, setMoves] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    // Initialize the game
    const initializeGame = useCallback(() => {
        // Create pairs of cards
        const cardPairs = [...cardTypes, ...cardTypes].map((type, index) => ({
            id: index,
            type,
            flipped: false,
            matched: false,
        }));

        // Shuffle the cards
        const shuffledCards = shuffleArray(cardPairs);
        setCards(shuffledCards);
        setFlippedCards([]);
        setMatchedPairs(0);
        setMoves(0);
        setGameOver(false);
        setTimer(0);
        setGameStarted(false);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const endGame = useCallback((success: boolean) => {
        if (timerInterval) clearInterval(timerInterval);
        setGameOver(true);
        setGameStarted(false);
        setTimeout(() => {
            onComplete(success);
        }, 1500);
    }, [timerInterval, onComplete]);

    // Handle game completion
    useEffect(() => {
        if (matchedPairs === cardTypes.length && gameStarted) {
            endGame(true);
        }
    }, [matchedPairs, gameStarted, endGame]);

    // Timer effect
    useEffect(() => {
        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [timerInterval]);

    const shuffleArray = (array: Card[]): Card[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const startGame = () => {
        setGameStarted(true);
        const interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
        setTimerInterval(interval);
    };

    const handleCardClick = (id: number) => {
        // Start the game on first card click
        if (!gameStarted && !gameOver) {
            startGame();
        }

        // Ignore clicks if game is over or the card is already flipped or matched
        if (gameOver || flippedCards.length >= 2) return;

        const clickedCard = cards.find((card) => card.id === id);
        if (!clickedCard || clickedCard.flipped || clickedCard.matched) return;

        // Flip the card
        const updatedCards = cards.map((card) =>
            card.id === id ? { ...card, flipped: true } : card
        );
        setCards(updatedCards);

        // Add to flipped cards
        const newFlippedCards = [...flippedCards, id];
        setFlippedCards(newFlippedCards);

        // If two cards are flipped, check for a match
        if (newFlippedCards.length === 2) {
            setMoves((prevMoves) => prevMoves + 1);

            const [firstId, secondId] = newFlippedCards;
            const firstCard = updatedCards.find((card) => card.id === firstId);
            const secondCard = updatedCards.find((card) => card.id === secondId);

            if (firstCard && secondCard && firstCard.type === secondCard.type) {
                // Match found
                const matchedCards = updatedCards.map((card) =>
                    card.id === firstId || card.id === secondId
                        ? { ...card, matched: true }
                        : card
                );
                setCards(matchedCards);
                setFlippedCards([]);
                setMatchedPairs((prevPairs) => prevPairs + 1);
            } else {
                // No match, flip cards back after a delay
                setTimeout(() => {
                    const resetCards = updatedCards.map((card) =>
                        card.id === firstId || card.id === secondId
                            ? { ...card, flipped: false }
                            : card
                    );
                    setCards(resetCards);
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="game-container">
            <div className="mb-6">
                <div className="card-header">
                    <h2>Memory Match</h2>
                    <button
                        onClick={onExit}
                        className="btn btn-secondary"
                    >
                        Exit Game
                    </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                    <div className="user-profile-value">
                        <span>Moves:</span> {moves}
                    </div>
                    <div className="user-profile-value">
                        <span>Time:</span> {formatTime(timer)}
                    </div>
                    <div className="user-profile-value">
                        <span>Pairs:</span> {matchedPairs}/{cardTypes.length}
                    </div>
                </div>
            </div>

            <div className="memory-grid">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`memory-card ${card.flipped ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
                    >
                        <div
                            className="memory-card-front"
                            style={{ background: "#111", color: "#fff", border: "2px solid #333" }}
                        >
                            {(card.flipped || card.matched) && card.type}
                        </div>
                        <div
                            className="memory-card-back"
                            style={{ background: "#111", border: "2px solid #333" }}
                        ></div>
                    </div>
                ))}
            </div>

            {gameOver && (
                <div className="alert alert-success mt-8 text-center">
                    <p className="user-profile-value">Game Complete!</p>
                    <p>You matched all pairs in {moves} moves and {formatTime(timer)}!</p>
                </div>
            )}

            <div className="mt-8 text-center">
                <button
                    onClick={initializeGame}
                    className="btn btn-primary btn-lg"
                >
                    New Game
                </button>
            </div>
        </div>
    );
} 