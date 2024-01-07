import React from 'react'

// Import from classes
import { mySocket, MySocket } from 'src/apis/socket';
import { Game, GameType } from 'src/classes/Game'

// Import from hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';

// Locally Import
// Import state configs
import { ScoreBoardStateConfigs } from '../state/score_board';

// Import socket event listeners
import { ScoreBoardSocketEvents } from '../socket_events/score_board';

interface ScoreBoardProps {
  game: GameType;
  extendClassName?: string;
}

/**
 * Component is used to render score board for game.
 * @param props 
 * @returns 
 */
export default function ScoreBoard(props: ScoreBoardProps) {
  const [ state, setStateFns ] = useStateWESSFns(
    ScoreBoardStateConfigs.getInitialState(),
    ScoreBoardStateConfigs.getStateFns
  );

  let firstPlayer = Game.getPlayerInformation(props.game, "first");
  let secondPlayer = Game.getPlayerInformation(props.game, "second");

  let fpName = firstPlayer ? firstPlayer.name : "Unknow01";
  let spName = secondPlayer ? secondPlayer.name : "Unknow02";
  let fpScore = firstPlayer ? firstPlayer.score : 0;
  let spScore = secondPlayer ? secondPlayer.score : 0;

  // Set up somethings
  React.useEffect(() => {
    // Set up listener for socket event.
    let gameConnectionStatusListener = mySocket.addEventListener(
      MySocket.EventNames.gameConnectionStatus,
      ScoreBoardSocketEvents.getGameConnectionStatusListener({
        setStateFns: setStateFns
      })
    );

    return function() {
      mySocket.removeEventListener(MySocket.EventNames.gameConnectionStatus, gameConnectionStatusListener);
    }
  }, []);

  return (
    <div className={"score-board" + (props.extendClassName ? " " + props.extendClassName : "")}>
      <div className="flex-box">
        {/* First player information */}
        <div className="score-board-part left">
          <div className="flex-box flex-row ait-center">
            {
              firstPlayer?.img
              ? ( 
                <img className="score-board-avatar me-1" src={firstPlayer?.img} alt="representation image of first player" />
              ) : (
                <div className="empty-avatar circle me-1"></div>
              )
            }
            <p className="flex-box flex-row ait-center">
              <span className="score-board-player-name">{fpName}</span>
              <strong className="mx-1 x-mark">{fpScore}</strong>
            </p>
          </div>
          {
            state.lostConnectionPlayer?.id === firstPlayer?.id
            && (
              <p className="fs-5 txt-clr-error">Mất kết nối</p>
            )
          }
        </div>

        {/* Second player information */}
        <div className="score-board-part right">
          <div className="flex-box flex-row ait-center">
            <p className="flex-box flex-row ait-center">
              <strong className="mx-1 o-mark">{spScore}</strong>
              <span className="score-board-player-name">{spName}</span>
            </p>
            {
              secondPlayer?.img
              ? (
                <img className="score-board-avatar ms-1" src={secondPlayer?.img} alt="representation image of first player" />
              ) : (
                <div className="empty-avatar circle ms-1"></div>
              )
            }
          </div>
          {
            state.lostConnectionPlayer?.id === secondPlayer?.id
            && (
              <p className="fs-5 txt-clr-error txt-right">Mất kết nối</p>
            )
          }
        </div>
      </div>
      {/* Turn indicator */}
      <div className="turn mt-1">
        <div className={"turn-indicator " + (props.game.currentTurn)}></div>
      </div>
    </div>
  )
}
