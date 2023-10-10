import React from 'react';
import { useParams } from 'react-router-dom';

// Import class objects
import { Game, MarkInfoType, Coordinate } from 'src/classes/Game';
import { Player, PlayerType } from 'src/classes/Player';
import { Message, MySocket } from 'src/apis/socket';

// Import hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';
import { usePlayerState } from 'src/hooks/usePlayer';
import { useGlobalData } from 'src/hooks/useGlobalData';
import { useSocket } from 'src/hooks/useSocket';

// Import components
import Grid from 'src/components/grid/Grid';
import Mark from './Mark';
import EndLine from './EndLine';
import ScoreBoard from './ScoreBoard';

// Import types
import { GamePageProps } from './GamePage.props';

// Import styles
import './GamePage.styles.css';

interface GamePageElements {
  page: HTMLDivElement | null
}

type TypeOfGame = "offline" | "online";

/**
 * Component is used to render page of Game.
 * @param props 
 * @returns 
 */
export default function GamePage(props: GamePageProps) {
  /**
   * Type of game, there are 2 types of game:
   * - offline: allow 2 players play in the same device.
   * - online: allow 2 players play in various device through internet.
   */
  let { type } = useParams<{ type: TypeOfGame }>();
  const player = usePlayerState();
  const { data } = useGlobalData();
  const { socket, EventNames } = useSocket();
  const [gameState, gameStateFns] = useStateWESSFns({
    game: new Game(
      "game-01",
      "2 players game",
      // Create player "X"
      ( 
        type === "online"
          ? new Player(player.getInformation())
          : new Player("01")
      ),
      // Create player "O"
      new Player("02")
    )
  }, function(changeState) {
    return {
      /**
       * Use to add mark to `markMap`.
       * @param x 
       * @param y 
       * @param t 
       */
      addMark: function(x: number, y: number, t: number) {
        changeState("game", function(game) {
          let key = Game.createKey(x, y);
          let result;
          // Decide what mark will be added
          let element = <Mark key={key} x={x} y={y} t={t} mark='X' />;

          if(game.currentTurn === "O") {
            element = <Mark key={key} x={x} y={y} t={t} mark='O' />;
          }

          // Add mark
          game.addMarkInfo(
            key,
            game.currentTurn,
            element
          );

          // Find winner
          result = game.findWinner(x, y);

          if(result) {
            game.setWinner(result.player);
            game.addMarkInfo(
              result.from + result.to,
              game.currentTurn,
              <EndLine key={result.from + result.to} from={result.endline.from} to={result.endline.to} />
            );
            console.log("Result: ", result);
            return game;
          }

          // Swith turn
          if(game.currentTurn === "X") game.setTurn("O")
          else game.setTurn("X");
          
          return game;
        });
      },

      /**
       * Use this function to reset the game.
       */
      resetGame: function() {
        changeState("game", function(game) {
          game.reset();
          return game;
        });
      }
    }
  });

  const elementRefs = React.useRef<GamePageElements>({
    page: null
  });

  React.useEffect(() => {
    if(type === "offline") return;

    // Codes below will be execute if type is `online`
    let joinGameListener = socket.addEventListener(
      EventNames.joinGame,
      (m: Message<PlayerType>) => {

      }
    );
    
    let emitMarkListener = socket.addEventListener(
      EventNames.emitMark,
      (m: Message<Coordinate>) => {

      }
    );

    let leaveGameListener = socket.addEventListener(
      EventNames.leaveGame,
      (m: Message<string>) => {

      }
    );

    return function() {
      // Execute when exit game, that mean when GamePage is destroyed.
      socket.removeEventListener(EventNames.emitMark, emitMarkListener);
      socket.removeEventListener(EventNames.joinGame, joinGameListener);
      socket.removeEventListener(EventNames.leaveGame, leaveGameListener);
    };
  }, []);

  return (
    <div ref={ref => elementRefs.current.page = ref} className={"game-page" + (gameState.game.currentTurn === "O" ? " O" : " X")}>
      <Grid
        height={"100%"}
        emitCoordinate={(x, y, t) => {
          if(gameState.game.hasWinner()) return;

          if(type === "online")
            socket.emit<Coordinate>(MySocket.createMessage(
              EventNames.emitMark,
              undefined,
              { x, y }
            ));

          if(!gameState.game.hasMarkIn(x, y))
            gameStateFns.addMark(x, y, t);
        }}
        renderSVGElements={() => {
          return gameState.game.renderMarks(function(value) {
            return value?.element!;
          });
        }}
        renderItem={(beh) => (
          <>
            <div className="game-info p-1 m-3">
              <h3 className="flex-box ait-center">LƯỢT
                {
                  gameState.game.currentTurn === "X"
                    ? <span className="material-symbols-outlined x-mark ms-1 fs-1">close</span>
                    : <span className="material-symbols-outlined o-mark ms-1 fs-1">radio_button_unchecked</span>
                }
              </h3>
              <ScoreBoard extendClassName='mt-2' game={gameState.game} />
            </div>
            <div className="grid-controller p-1 m-3 flex-box flex-col">
              {
                gameState.game.hasWinner() && (
                  <span
                    onClick={() => { gameStateFns.resetGame() }}
                    className="material-symbols-outlined btn-no-padd spe-outline p-1 mb-4"
                  >
                    restart_alt
                  </span>
                )
              }
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
          </>
        )}
      />
    </div>
  )
}