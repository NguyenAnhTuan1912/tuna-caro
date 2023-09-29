import React from 'react';

// Import components
import Grid from 'src/components/grid/Grid';

// Import types
import { GamePageProps } from './GamePage.props';

// Import styles
import './GamePage.styles.css';

export default function GamePage(props: GamePageProps) {
  return (
    <div className="game-page">
      <Grid
        renderItem={(beh) => (
          <div className="grid-controller p-1 flex-box flex-col">
            <span
              onClick={() => { beh.zoomIn() }}
              className="material-symbols-outlined btn-no-padd outline p-1"
            >
                add
            </span>
            <span
              onClick={() => { beh.zoomOut() }}
              className="material-symbols-outlined btn-no-padd spe-outline p-1"
            >
                remove
            </span>
          </div>
        )}
      />
    </div>
  )
}