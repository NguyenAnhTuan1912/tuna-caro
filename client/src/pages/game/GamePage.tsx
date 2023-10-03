import React from 'react';

// Import class objects
import { Game } from 'src/classes/Game';

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


function KeyGuide(props: KeyGuideProps) {
  return (
    <div className="keyguide">
      <span className="me-1">{props.title}</span>
      <span className="fw-bold">{props.keys}</span>
    </div>
  );
}

/**
 * Component use to render page of Game.
 * @param props 
 * @returns 
 */
export default function GamePage(props: GamePageProps) {
  const [gameState, gameStateFns] = useStateWESSFns({
    game: new Game("game-01", "Hello")
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
          let key = `(${x},${y})`;
          let coorX = x * t + (t / 2);
          let coorY = y * t + (t / 2);
          game.addMarkInfo(
            key,
            game.currentTurn,
            <circle key={key} cx={coorX} cy={coorY} r={t / 2 - 5} fill="none" stroke="red" strokeWidth="2"></circle>
          );
          return game;
        });
      },
      /**
       * Use to switch turn.
       */
      swithTurn() {
        changeState("game", function(game) {
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

  console.log("Game: ", gameState.game);

  return (
    <div ref={ref => elementRefs.current.page = ref} className="game-page">
      <Grid
        height={"100%"}
        emitCoordinate={(x, y, t) => {
          gameStateFns.addMark(x, y, t);
          gameStateFns.swithTurn();
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