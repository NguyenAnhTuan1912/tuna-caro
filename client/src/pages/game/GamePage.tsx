import React from 'react';

// Import class objects
import { Game } from 'src/classes/Game';
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
          let less = 5;
          let result;
          let element = <path key={key} d={game.createPathDForX(x, y, t, less)} fill="none" stroke="red" strokeWidth="2" />;

          if(game.currentTurn === "O") {
            let cx = x * t + (t / 2);
            let cy = y * t + (t / 2);
            element = <circle key={key} cx={cx} cy={cy} r={t / 2 - less} fill="none" stroke="blue" strokeWidth="2"></circle>;
          }

          game.addMarkInfo(
            key,
            game.currentTurn,
            element
          );

          if(game.currentTurn === "X") game.setTurn("O")
          else game.setTurn("X");

          result = game.findWinner(x, y);

          if(result) {
            game.setWiner(result.player);
            console.log("Winner: ", result);
          }
          
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

  console.log("Game: ", gameState.game);

  return (
    <div ref={ref => elementRefs.current.page = ref} className="game-page">
      <Grid
        height={"100%"}
        emitCoordinate={(x, y, t) => {
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