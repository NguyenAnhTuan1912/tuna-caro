import React from 'react';

// Import class objects
import { Game } from 'src/classes/Game';
import { Player } from 'src/classes/Player';

// Import hooks
import { useLangState } from 'src/hooks/useLang';
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';
import { useSFX } from 'src/hooks/useSFX';

// Import from components
import { NotifiableSnackBars } from 'src/components/snack_bar/SnackBar';
import Grid from 'src/components/grid/Grid';
import ScoreBoard from './components/ScoreBoard';

// Locally Import
// Import functions.
import { GameCoreStateConfigs } from './state/game_core';

// Import components
import PauseGameLayer from './components/PauseGameLayer';

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
  const [state, stateFns] = useStateWESSFns(
    GameCoreStateConfigs.getInitialState(props.game.id!, props.game.name!, props.game.status === "Waiting"),
    function(changeState) {
      return GameCoreStateConfigs.getStateFns(changeState, props)
    }
  );
  const sfx = useSFX();
  const { langTextJSON } = useLangState();

  const elementRefs = React.useRef<GamePageElements>({
    page: null
  });

  // Some logic
  const winner = Game.getWinner(state.game);
  const hasWinner = !!(winner);
  const canResetBtnShown = hasWinner && (!props.host
    ? true
    : props.host.id === props.mainPlayer!.id
      ? true
      : false)

  React.useEffect(() => {
    /*
      If there aren't host, that mean the game is offline.
      Then create 2 player.
    */
    if(!props.host) {
      // Create 2 new players
      let firstPlayer = Player.createPlayer("01");
      let secondPlayer = Player.createPlayer("02");

      // Set mark (default)
      firstPlayer.mark = "X";
      secondPlayer.mark = "O";

      // Add to game and update state as the same time.
      stateFns.appendPlayer("first", firstPlayer);
      stateFns.appendPlayer("second", secondPlayer);
    } else {
      /*
        That mean the game has host => is online game.
      */
      // Create player. The second player may not in the game (can join later).
      // That mean the player has just created the game.
      let firstPlayer = props.host;
      let secondPlayer;

      // If the game has second player, that mean the player has just joined the game.
      if(props.game._players && props.game._players["second"]) secondPlayer = props.game._players["second"];

      // Add player to the game and prepare to update state.
      stateFns.appendPlayer("first", firstPlayer);
      if(secondPlayer) {
        stateFns.appendPlayer("second", secondPlayer);

        // Resume game
        stateFns.pause(false);
      };

      // Set host and update state.
      stateFns.setHost(firstPlayer);
    }

    if(props.useEffectCB) {
      return props.useEffectCB(stateFns);
    }
  }, []);

  return (
    <>
      {
        /*
          Render a Layer for pausing game.

          Because the status of game is `Waiting`,
          so the `text` of PauseGameLayer must be "Đang chờ người chơi khác..." or "Waiting for another player...".
        */ 
        state.game.status === "Waiting"
        && (
          <PauseGameLayer />
        )
      }
      {
        /*
          Render a Layer for revealing winner.

          If game has winner, so a layer is rendered to reveal the name of winner.
        */
        // hasWinner && (
        //   <WinnerLayer
        //     winner={winner}
        //     button={
        //       canResetBtnShown ? (
        //         <Button
        //           onClick={() => {
        //             if(props.onResetClick) props.onResetClick();
        //             stateFns.startNewRound();
        //           }}
        //         >
        //           <span className="material-symbols-outlined me-2">restart_alt</span>
        //           Chơi lại
        //         </Button>
        //       ) : undefined
        //     }
        //   />
        // )
      }
      <div ref={ref => elementRefs.current.page = ref} className={"game-page" + (state.game.currentTurn === "O" ? " O" : " X")}>
        <Grid
          height={"100%"}
          emitCoordinate={(x, y, t) => {
            // Status Checking
            // Check if game status is `Waiting`, then don't let player hit table.
            if(state.game.status === "Waiting") return;

            // Turn Checking
            // Check if main player can mark, then prevent mark. Else continute.
            if(
              props.mainPlayer
              && props.mainPlayer.mark !== state.game.currentTurn
            ) return;

            // Winner Checking
            // Check if the game has winner, then prevent mark. Else continute.
            if(hasWinner) return;

            // Existed Mark Checking
            // Check if this square has mark, then prevent mark. Else continute.
            if(Game.hasMarkIn(state.game, x, y)) return;

            // Play sfx
            sfx.play("hitTableSound");

            // If pass all the condition (except check square), add new mark.
            stateFns.addMark(x, y, t, undefined, true);
          }}

          renderSVGElements={() => {
            return Game.renderMarks(state.game, function(value) {
              return value?.element!;
            });
          }}

          renderItem={(beh) => (
            <>
              <div className="game-info p-1">
                {/* <h3 className="flex-box ait-center">LƯỢT
                  {
                    state.game.currentTurn === "X"
                      ? <span className="material-symbols-outlined x-mark ms-1 fs-1">close</span>
                      : <span className="material-symbols-outlined o-mark ms-1 fs-1">radio_button_unchecked</span>
                  }
                </h3> */}
                <ScoreBoard game={state.game} />
              </div>
              <div className="grid-controller left m-1 flex-box flex-col">
                <p className="flex-box ait-center">
                  {state.game.id}
                  <span
                    onClick={() => {
                      navigator.clipboard.writeText(state.game.id).then(() => {
                        NotifiableSnackBars.success(langTextJSON.global.copyContentText + " Game ID.");
                      })
                    }}
                    className="material-symbols-outlined btn-transparent float-bubble rounded-4 ms-1"
                  >
                    content_copy
                  </span>
                </p>
              </div>
              <div className="grid-controller right m-1 flex-box flex-col">
                {
                  canResetBtnShown && (
                    <span
                      onClick={() => {
                        if(props.onResetClick) props.onResetClick();
                        stateFns.startNewRound()
                      }}
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
    </>
  )
}