import React from 'react';

// Import components
import GameCore from './GameCore';

/**
 * This component depend on `GamePage` to render an offline game.
 * @returns 
 */
export default function GameOffline() {
  return (
    <GameCore
      game={{
        id: "TWO_PLAYERS_GAME",
        name: "2 players game"
      }}
      playerX={{
        id: "01",
        name: "Player",
        isWinner: false,
        score: 0,
        mark: "X"
      }}
      playerO={{
        id: "02",
        name: "Player",
        isWinner: false,
        score: 0,
        mark: "O"
      }}
    />
  )
}