import React from 'react';

// Import class objects
import { Game, MarkType } from 'src/classes/Game';
import { Player, PlayerType } from 'src/classes/Player';

// Import hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';

// Import components
import Grid from 'src/components/grid/Grid';
import Mark from './Mark';
import EndLine from './EndLine';
import ScoreBoard from './ScoreBoard';

// Import types
import { GameCoreProps } from './Game.props';

// Import styles
import './GamePage.styles.css';

interface GamePageElements {
  page: HTMLDivElement | null
}

/**
 * Component is used to render page of Game.
 * @param props 
 * @returns 
 */
export default function GameCore(props: GameCoreProps) {
  const [gameState, gameStateFns] = useStateWESSFns({
    game: new Game(
      props.game.id!,
      props.game.name!,
      // Create player "X"
      new Player(
        props.playerX.id,
        props.playerX.name,
        "X",
        false,
        0
      ),
      // Create player "O"
      new Player(
        props.playerO.id,
        props.playerO.name,
        "O",
        false,
        0
      )
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
      },

      /**
       * Use this function to add player to game.
       * @param player 
       */
      appendPlayer: function(turn: string, player: PlayerType) {
        changeState("game", function(game) {
          // Set new player.
          game.setPlayer(turn, new Player(player));
          console.log("Game after add player: ", game);
          return game;
        });
      },

      /**
       * Use this function to remove a player from game.
       * @param g 
       */
      removePlayer: function(g: MarkType | string) {
        changeState("game", function(game) {
          // If a player leave the game or is kicked by host. The game will be reset.
          game.removePlayer(g);
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
    if(props.useEffectCB) {
      console.log("GameCore setup useEffect.");
      return props.useEffectCB(gameStateFns);
    }
  }, []);

  return (
    <div ref={ref => elementRefs.current.page = ref} className={"game-page" + (gameState.game.currentTurn === "O" ? " O" : " X")}>
      <Grid
        height={"100%"}
        emitCoordinate={(x, y, t) => {
          if(gameState.game.hasWinner()) return;

          if(!gameState.game.hasMarkIn(x, y)) {
            if(props.onEmitCoordinate) props.onEmitCoordinate(x, y, t, gameState.game.currentTurn);
            gameStateFns.addMark(x, y, t);
          }
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