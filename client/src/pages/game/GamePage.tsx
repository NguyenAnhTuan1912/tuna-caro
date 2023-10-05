import React from 'react';

// Import class objects
import { Game, MarkType, Coordinate } from 'src/classes/Game';
import { Player } from 'src/classes/Player';

// Import hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';

// Import components
import Grid from 'src/components/grid/Grid';

// Import types
import { GamePageProps } from './GamePage.props';

// Import styles
import './GamePage.styles.css';

interface GamePageElements {
  page: HTMLDivElement | null
}

interface KeyGuideProps {
  title: string;
  keys: string;
}

interface MarkProps {
  mark: MarkType;
  x: number;
  y: number;
  t: number;
}

interface EndLineProps {
  from: Coordinate;
  to: Coordinate;
}

/**
 * Component is used to render a guide for keys.
 * @param props 
 * @returns 
 */
function KeyGuide(props: KeyGuideProps) {
  return (
    <div className="keyguide">
      <span className="me-1">{props.title}</span>
      <span className="fw-bold">{props.keys}</span>
    </div>
  );
}

/**
 * Component is used to render mark O or X depend on what is `mark`. Receive coordinate and `t` constant.
 * @param props 
 * @returns 
 */
function Mark(props: MarkProps) {
  if(props.mark === "O") {
    let cx = props.x * props.t + (props.t / 2);
    let cy = props.y * props.t + (props.t / 2);
    return <circle className="o-mark mark" cx={cx} cy={cy} r={props.t / 2 - Game.less} fill="none" stroke="blue" strokeWidth="2"></circle>;
  }

  return (
    <path className="x-mark mark" d={Game.createPathDForX(props.x, props.y, props.t, Game.less)} fill="none" stroke="red" strokeWidth="2" />
  )
}

/**
 * Compunent is used to render the end line of game when game has winner.
 * @param props 
 * @returns 
 */
function EndLine(props: EndLineProps) {
  let topLeft = `${props.from.x * Game.t},${props.from.y * Game.t}`;
  let bottomRight = `${props.to.x * Game.t},${props.to.y * Game.t}`;

  return (
    <path className="end-line mark" d={`M ${topLeft} L ${bottomRight}`} fill="none" strokeWidth="2" />
  )
}

/**
 * Component is used to render page of Game.
 * @param props 
 * @returns 
 */
export default function GamePage(props: GamePageProps) {
  const [gameState, gameStateFns] = useStateWESSFns({
    game: new Game("game-01", "Hello", new Player("player01", "Tuna Nguyen"), new Player("player02", "Tony"))
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
      }
    }
  });

  const elementRefs = React.useRef<GamePageElements>({
    page: null
  });

  React.useEffect(() => {
  }, []);

  return (
    <div ref={ref => elementRefs.current.page = ref} className={"game-page" + (gameState.game.currentTurn === "O" ? " O" : " X")}>
      <Grid
        height={"100%"}
        emitCoordinate={(x, y, t) => {
          if(gameState.game.hasWinner()) {
            console.log("Marked: ", x, y);
          }
          if(!gameState.game.hasMarkIn(x, y) && !gameState.game.hasWinner())
            gameStateFns.addMark(x, y, t);
        }}
        renderSVGElements={() => {
          return gameState.game.renderMarks(function(value) {
            return value?.element!;
          });
        }}
        renderItem={(beh) => (
          <>
            <div className="guide p-1 m-3">
              <KeyGuide
                title='Di chuyển: giữ'
                keys='Space + LMB'
              />
              <KeyGuide
                title='Đánh dấu:'
                keys='LMB'
              />
            </div>
            <div className="turn-info p-1 m-3">
              <h3 className="flex-box ait-center">LƯỢT
                {
                  gameState.game.currentTurn === "X"
                    ? <span className="material-symbols-outlined x-mark ms-1 fs-1">close</span>
                    : <span className="material-symbols-outlined o-mark ms-1 fs-1">radio_button_unchecked</span>
                }
              </h3>
            </div>
            <div className="grid-controller p-1 m-3 flex-box flex-col">
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