import React from 'react'

// Import classes
import { Game } from 'src/classes/Game'

interface ScoreBoardProps {
  game: Game;
  extendClassName?: string;
}

/**
 * Component is used to render score board for game.
 * @param props 
 * @returns 
 */
export default function ScoreBoard(props: ScoreBoardProps) {
  let playerX = props.game.getPlayerInformation("X");
  let playerO = props.game.getPlayerInformation("O");

  return React.useMemo(() => (
    <div className={"score-board" + (props.extendClassName ? " " + props.extendClassName : "")}>
      <p>
        <span className="x-mark">{playerX.name}</span>:
        <strong className="mx-1 x-mark">{playerX.score}</strong>
      </p>
      <p>
        <span className="o-mark">{playerO.name}</span>:
        <strong className="mx-1 o-mark">{playerO.score}</strong>
      </p>
    </div>
  ), [playerX.score, playerO.score]);
}
