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
  let firstPlayer = props.game.getPlayerInformation("first");
  let secondPlayer = props.game.getPlayerInformation("second");

  let fpName = firstPlayer ? firstPlayer.name : "Unknow01";
  let spName = secondPlayer ? secondPlayer.name : "Unknow02";
  let fpScore = firstPlayer ? firstPlayer.score : 0;
  let spScore = secondPlayer ? secondPlayer.score : 0;

  return React.useMemo(() => (
    <div className={"score-board" + (props.extendClassName ? " " + props.extendClassName : "")}>
      <p>
        <span className="x-mark">{fpName}</span>:
        <strong className="mx-1 x-mark">{fpScore}</strong>
      </p>
      <p>
        <span className="o-mark">{spName}</span>:
        <strong className="mx-1 o-mark">{spScore}</strong>
      </p>
    </div>
  ), [fpName, fpScore, spName, spScore]);
}
