import React from 'react'

// Import from components
import Button from 'src/components/button/Button';

// Locally Import
import { PauseGameLayerProps } from './Game.props';

export default function PauseGameLayer(props: PauseGameLayerProps) {
  return (
    <div className="pause-game-layer flex-box flex-rw ait-center jc-center">
      <Button
        isTransparent
        hasBorder={false}
        hasPadding={false}
        onClick={() => {
          if(!props.canResume) return;
        }}
      >
        <span className="material-symbols-outlined fs-xl txt-clr-background">play_arrow</span>
      </Button>
      <p className="fs-xl txt-clr-background ms-2">Tạm dừng</p>
    </div>
  )
}
