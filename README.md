# QuestXP

A play-to-earn platform built with Civic Auth embedded wallets for the [Civic Auth Hackathon](https://dorahacks.io/hackathon/civic-auth/detail).

## Overview

QuestXP is a platform where users can play simple, engaging games to earn points, which can then be redeemed for token airdrops. The platform leverages Civic Auth's embedded wallets to provide a seamless web3 experience without the typical onboarding friction.

## Features

- **Embedded Wallet Integration**: Users can create and use Solana wallets through Civic Auth without needing to understand crypto concepts.
- **Multiple Mini-Games**:
  - Memory Match: A card matching game that tests memory skills
  - Crypto Quiz: A quiz game that tests knowledge of crypto concepts
- **Points System**: Users earn points by playing and winning games
- **Token Airdrops**: Points can be redeemed for token airdrops at different tiers
- **Leaderboard**: Users can compete for top positions and earn bonus rewards

## Technology Stack

- Next.js 15 with App Router
- Civic Auth Web3 SDK
- Solana Web3.js
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/N-45div/QuestXP.git
   cd QuestXP
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_CLIENT_ID=your_civic_auth_client_id
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## How It Works

1. **Authentication**: Users sign in using Civic Auth
2. **Wallet Creation**: Upon first login, users can create an embedded wallet
3. **Gameplay**: Users can play games to earn points
4. **Token Rewards**: Points can be redeemed for token airdrops
5. **Leaderboard Competition**: Top players earn additional rewards

## Token Airdrop Tiers

- 100 points: 5 tokens
- 500 points: 30 tokens
- 1000 points: 100 tokens

## Future Enhancements

- Additional games and challenges
- NFT rewards for achievements
- Social features for sharing and inviting friends
- Integration with other Solana DeFi protocols
- Mobile app version

## License

MIT

## Acknowledgments

- Civic Auth for providing the embedded wallet infrastructure
- Solana for the fast and low-cost blockchain
- DoraHacks for hosting the hackathon
