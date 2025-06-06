"use client";

import { useState, useEffect, useCallback } from "react";

interface QuizGameProps {
  onComplete: (success: boolean) => void;
  onExit: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is a blockchain?",
    options: [
      "A type of cryptocurrency",
      "A distributed, immutable ledger",
      "A centralized database",
      "A programming language"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "What does NFT stand for?",
    options: [
      "New Financial Token",
      "Non-Fungible Token",
      "Network File Transfer",
      "National Fintech Technology"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Which of these is NOT a cryptocurrency?",
    options: [
      "Bitcoin",
      "Ethereum",
      "Solana",
      "PayPal"
    ],
    correctAnswer: 3
  },
  {
    id: 4,
    question: "What is a smart contract?",
    options: [
      "A legal agreement between two parties",
      "Self-executing code on a blockchain",
      "A type of cryptocurrency wallet",
      "A hardware device for storing crypto"
    ],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "What consensus mechanism does Solana primarily use?",
    options: [
      "Proof of Work",
      "Proof of Stake",
      "Proof of History",
      "Delegated Proof of Stake"
    ],
    correctAnswer: 2
  },
  {
    id: 6,
    question: "What is a crypto wallet?",
    options: [
      "A physical device that stores cryptocurrencies",
      "Software that manages private keys",
      "A bank account for digital assets",
      "An exchange for trading cryptocurrencies"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "What is DeFi?",
    options: [
      "Decentralized Finance",
      "Digital Financial Institution",
      "Distributed File Integration",
      "Direct Finance Investment"
    ],
    correctAnswer: 0
  },
  {
    id: 8,
    question: "What is the main advantage of using embedded wallets?",
    options: [
      "They offer better security than hardware wallets",
      "They simplify user onboarding for Web3 applications",
      "They provide higher transaction speeds",
      "They allow for offline transactions"
    ],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "What is a DAO?",
    options: [
      "Digital Asset Organization",
      "Decentralized Autonomous Organization",
      "Distributed Application Overlay",
      "Direct Access Operation"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "What is the purpose of Civic Auth?",
    options: [
      "To verify government IDs",
      "To provide secure identity verification and authentication",
      "To create cryptocurrency wallets",
      "To authorize bank transactions"
    ],
    correctAnswer: 1
  }
];

export default function QuizGame({ onComplete, onExit }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // Initialize with shuffled questions
  useEffect(() => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuestions(shuffled);
  }, []);

  // Timer effect
  useEffect(() => {
    if (quizComplete || isAnswerCorrect !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isAnswerCorrect, quizComplete, handleTimeout]);

  const handleTimeout = useCallback(() => {
    setIsAnswerCorrect(false);
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  }, [nextQuestion]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswerCorrect !== null || quizComplete) return;

    setSelectedAnswer(answerIndex);
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const correct = answerIndex === currentQuestion.correctAnswer;

    setIsAnswerCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setTimeLeft(30);
    } else {
      completeQuiz();
    }
  }, [currentQuestionIndex, shuffledQuestions.length, completeQuiz]);

  const completeQuiz = () => {
    setQuizComplete(true);
    const success = score >= 3; // Pass if at least 3 out of 5 questions are correct

    setTimeout(() => {
      onComplete(success);
    }, 2000);
  };

  const restartQuiz = () => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5);
    setShuffledQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setScore(0);
    setQuizComplete(false);
    setTimeLeft(30);
  };

  if (shuffledQuestions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="game-container">
      <div className="card-header mb-6">
        <h2>Crypto Quiz</h2>
        <button
          onClick={onExit}
          className="btn btn-secondary"
        >
          Exit Quiz
        </button>
      </div>

      {!quizComplete ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="user-profile-value">
              Question {currentQuestionIndex + 1}/{shuffledQuestions.length}
            </div>
            <div className="user-profile-value">
              Score: {score}/{shuffledQuestions.length}
            </div>
            <div className="user-profile-value" style={timeLeft < 10 ? { color: '#ef4444' } : {}}>
              Time: {timeLeft}s
            </div>
          </div>

          <div className="card mb-6">
            <h3 className="mb-4">{currentQuestion.question}</h3>

            <div>
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`quiz-option ${selectedAnswer === index
                    ? isAnswerCorrect
                      ? "correct"
                      : "incorrect"
                    : ""
                    } ${selectedAnswer !== null &&
                      index === currentQuestion.correctAnswer
                      ? "correct"
                      : ""
                    }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          {isAnswerCorrect !== null && (
            <div className={`alert ${isAnswerCorrect ? "alert-success" : "alert-error"} text-center`}>
              {isAnswerCorrect ? "Correct!" : "Incorrect!"}
            </div>
          )}
        </>
      ) : (
        <div className="card text-center">
          <h3 className="mb-4">Quiz Complete!</h3>
          <p className="mb-6 user-profile-value">
            Your score: {score}/{shuffledQuestions.length}
          </p>

          {score >= 3 ? (
            <div className="alert alert-success mb-6">
              Congratulations! You&apos;ve earned points for your knowledge!
            </div>
          ) : (
            <div className="alert alert-warning mb-6">
              Keep learning! You need at least 3 correct answers to earn points.
            </div>
          )}

          <button
            onClick={restartQuiz}
            className="btn btn-primary btn-lg"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
} 