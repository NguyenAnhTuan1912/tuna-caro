import { useParams } from 'react-router-dom';

// Import from layouts
import BaseLayout from 'src/layouts/base_layout/BaseLayout';

// Import components
import GameOffline from './GameOffline';
import GameOnline from './GameOnline';

// Import types
import { TypeOfGame } from './Game.props';

/**
 * Use this component to render Game section.
 * @returns 
 */
export default function GamePage() {
  /**
   * Type of game, there are 2 types of game:
   * - offline: allow 2 players play in the same device.
   * - online: allow 2 players play in various device through internet.
   */
  const { type } = useParams<{
    type: TypeOfGame
  }>();

  return (
    <BaseLayout shownFooter={false} shownHeader={false}>
      {
        type === "offline" ? <GameOffline /> : <GameOnline />
      }
    </BaseLayout>
  )
}