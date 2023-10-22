import React from 'react';

// Import class objects
import { Game, PlayersKeyType, ResultType } from 'src/classes/Game';
import { Player, PlayerType } from 'src/classes/Player';

// Import hooks
import { useStateWESSFns } from 'src/hooks/useStateWESSFns';
import { useSFX } from 'src/hooks/useSFX';

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
    game: Game.createGame(props.game.id!, props.game.name!)
  }, function(changeState) {
    return {
      /**
       * Use to add mark to `markMap`. And handle something like emit message to server.
       * @param x 
       * @param y 
       * @param t 
       * @param result 
       * @param canCallOnAddMark 
       */
      addMark: function(
        x: number, y: number, t: number,
        result?: ResultType,
        canCallOnAddMark?: boolean
      ) {
        changeState("game", function(game) {
          let key = Game.createKey(x, y);
          // Decide what mark will be added
          let element = <Mark key={key} x={x} y={y} t={t} mark='X' />;

          if(game.currentTurn === "O") {
            element = <Mark key={key} x={x} y={y} t={t} mark='O' />;
          }

          // Add mark
          Game.addMarkInfo(
            game,
            key,
            game.currentTurn,
            element
          );

          // Find winner
          if(!result) result = Game.findWinner(game, x, y);

          if(result) {
            // Run onAddMark if game has winner.
            if(props.onAddMark && canCallOnAddMark)
              props.onAddMark(x, y, t, gameState.game.currentTurn, result);

            // Set winner for game.
            Game.setWinner(game, result.player);

            // Add mark.
            Game.addMarkInfo(
              game,
              result.from + result.to,
              game.currentTurn,
              <EndLine key={result.from + result.to} from={result.endline.from} to={result.endline.to} />
            );

            return game;
          }

          // Swith turn
          if(game.currentTurn === "X") Game.setTurn(game, "O")
          else Game.setTurn(game, "X");
          
          // Subscribe an event here to support outside.
          if(props.onAddMark && canCallOnAddMark) props.onAddMark(x, y, t, gameState.game.currentTurn);
          
          return game;
        });
      },

      /**
       * Use this function to reset the game.
       */
      resetGame: function() {
        changeState("game", function(game) {
          // Reset game.
          Game.reset(game);

          return game;
        });
      },

      /**
       * Use this function to start a new round.
       */
      startNewRound: function() {
        changeState("game", function(game) {
          // Start new round.
          Game.startNewRound(game);

          return game;
        });
      },

      /**
       * Use this function to add player to game.
       * @param player 
       */
      appendPlayer: function(key: PlayersKeyType, player: PlayerType) {
        changeState("game", function(game) {
          // Set new player.
          Game.setPlayer(game, key, player);
          
          // If game has 2 players, then change the status.
          if(Game.getPlayer(game, "first") && Game.getPlayer(game, "second")) {
            game.status = "Playing";
          }

          return game;
        });
      },

      /**
       * Use this function to set host.
       */
      setHost: function(player: PlayerType) {
        changeState("game", function(game) {
          // Set host
          Game.setHost(game, player);
          return game;
        });
      },

      /**
       * Use this function to remove a player from game.
       * @param g 
       */
      removePlayer: function(g: PlayersKeyType | string) {
        changeState("game", function(game) {
          // If a player leave the game or is kicked by host. The game will be reset.
          Game.removePlayer(game, g);

          // Reset state.
          Game.reset(game);

          // Because of leaving of a player, so game's status must be change
          game.status = "Waiting";

          return game;
        });
      }
    }
  });
  const sfx = useSFX();

  const elementRefs = React.useRef<GamePageElements>({
    page: null
  });

  // Some logic
  const hasWinner = Game.hasWinner(gameState.game);
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
      gameStateFns.appendPlayer("first", firstPlayer);
      gameStateFns.appendPlayer("second", secondPlayer);
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
      gameStateFns.appendPlayer("first", firstPlayer);
      if(secondPlayer) gameStateFns.appendPlayer("second", secondPlayer);

      // Set host and update state.
      gameStateFns.setHost(firstPlayer);
    }

    if(props.useEffectCB) {
      return props.useEffectCB(gameStateFns);
    }
  }, []);

  return (
    <div ref={ref => elementRefs.current.page = ref} className={"game-page" + (gameState.game.currentTurn === "O" ? " O" : " X")}>
      <Grid
        height={"100%"}
        emitCoordinate={(x, y, t) => {
          // Check if game status is `Waiting`, then don't let player hit table.
          if(gameState.game.status === "Waiting") return;

          // Check if main player can mark, else terminate.
          if(
            props.mainPlayer
            && props.mainPlayer.mark !== gameState.game.currentTurn
          ) return;

          // Check if the game has winner, else terminate.
          if(hasWinner) return;

          // Check if this square has mark, else terminate.
          if(Game.hasMarkIn(gameState.game, x, y)) return;

          // Play sfx
          sfx.play("hitTableSound");

          // If pass all the condition (except check square), add new mark.
          gameStateFns.addMark(x, y, t, undefined, true);
        }}

        renderSVGElements={() => {
          return Game.renderMarks(gameState.game, function(value) {
            return value?.element!;
          });
        }}

        renderItem={(beh) => (
          <>
            <div className="game-info p-4">
              <div>
                <h3 className="flex-box ait-center">LƯỢT
                  {
                    gameState.game.currentTurn === "X"
                      ? <span className="material-symbols-outlined x-mark ms-1 fs-1">close</span>
                      : <span className="material-symbols-outlined o-mark ms-1 fs-1">radio_button_unchecked</span>
                  }
                </h3>
                <ScoreBoard extendClassName='mt-2' game={gameState.game} />
              </div>
              <div>
                <p className="flex-box ait-center">
                  {gameState.game.id}
                  <span
                    className="material-symbols-outlined btn-transparent rounded-4 ms-1"
                  >
                    content_copy
                  </span>
                </p>
              </div>
            </div>
            <div className="grid-controller p-1 m-3 flex-box flex-col">
              {
                canResetBtnShown && (
                  <span
                    onClick={() => {
                      if(props.onResetClick) props.onResetClick();
                      gameStateFns.startNewRound()
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
  )
}