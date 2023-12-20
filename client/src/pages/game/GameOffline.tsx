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
        name: "2 players game",
        status: "Playing"
      }}
    />
  )
}