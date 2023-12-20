/**
 * Because this file contains JSX, so the extension of file must be `.tsx` instead of `.ts`.
 */

// Import from classes.
import { Game, ResultType, PlayersKeyType } from "src/classes/Game";
import { PlayerType } from "src/classes/Player";

// Import from hooks.
import { ChangeStateFnType } from "src/hooks/useStateWESSFns";

// Import components.
import Mark from "../../Mark";
import EndLine from "../../EndLine";

// Import types.
import { GameCoreProps } from "../../Game.props";

function getInitialState(id: string, name: string, isPause: boolean = true) {
  return {
    game: Game.createGame(id!, name!, isPause)
  }
}

function getStateFns(
  changeState: ChangeStateFnType<ReturnType<typeof getInitialState>>,
  props: GameCoreProps
) {
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
            props.onAddMark(x, y, t, game.currentTurn, result);

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
        
        // Subscribe an event here to support outside.
        if(props.onAddMark && canCallOnAddMark) props.onAddMark(x, y, t, game.currentTurn);
        
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
    },

    /**
     * Use this function to pause of resume game.
     * @param status 
     */
    pause: function(status: boolean = true) {
      changeState("game", function(game) {
        if(status) Game.pause(game);
        else Game.resume(game);
        return game;
      })
    }
  }
}

export const GameCoreStateConfigs = {
  getInitialState,
  getStateFns
};