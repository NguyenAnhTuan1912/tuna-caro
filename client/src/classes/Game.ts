import { MyMap } from "src/objects/MyMap";
import { Player, PlayerType } from "./Player";

export type Coordinate = {
  x: number;
  y: number;
};
export type GameStatus = "Waiting" | "Playing";
export type MarkType = "X" | "O";
export type PlayersKeyType = "first" | "second";
export type MarkInfoMapType = MyMap<string, MarkInfoType>;
export type CheckCaseLabels = "A" | "B" | "C" | "D";

export interface MarkInfoType {
  value: MarkType;
  element: JSX.Element;
};

export interface CheckWinnerCaseType {
  [Key: string]: {
    satisfactionTimes: number;
    from: string;
    to: string;
    fromCoor: Coordinate;
    toCoor: Coordinate;
  }
};

export interface ResultType {
  player: MarkType;
  from: string;
  to: string;
  endline: {
    from: Coordinate;
    to: Coordinate;
  }
};

export type DirectionCheckResultType = Array<{
  x: number;
  y: number;
  isSatisfactory: boolean;
  coor: string;
}>;

export interface GameType {
  id: string;
  name: string;
  status: GameStatus;
  currentTurn: MarkType;
  host: PlayerType | null;
  _markInfoMap: MarkInfoMapType | null;
  _winnerFinder: WinnerFinderType | null;
  _password: string | null;
  _players: { [key: string]: PlayerType | null } | null;
};

export interface GameRoomType {
  id: string;
  playerName: string;
  name: string;
  status: GameStatus;
  hasPassword: boolean;
}

interface DirectionCheckerType {
  A: {
    isDirecA: boolean;
    isDirecB: boolean;
  };
  B: {
    isDirecA: boolean;
    isDirecB: boolean;
  };
  C: {
    isDirecA: boolean;
    isDirecB: boolean;
  };
  D: {
    isDirecA: boolean;
    isDirecB: boolean;
  }
}

interface WinnerFinderType {
  markInfoMap: MarkInfoMapType;
  directionChecker: DirectionCheckerType;
}

/**
 * Use this class to create DirectionChecker and manipulate its data.
 */
class DirectionChecker {
  // Lock constructor
  private constructor() {}

  /**
   * Use this method to create a DirectionChecker object.
   */
  static createDirectionChecker(): DirectionCheckerType {
    return {
      A: {
        isDirecA: true,
        isDirecB: true
      },
      B: {
        isDirecA: true,
        isDirecB: true
      },
      C: {
        isDirecA: true,
        isDirecB: true
      },
      D: {
        isDirecA: true,
        isDirecB: true
      }
    }
  }

  /**
   * Use this static method to get a direction checker. Each case has 2 direction to check.
   * If one of these direction is not satisfy the condition, checker will stop check this direction.
   * @param table 
   * @returns 
   */
  static getDirectionCheck(dchker: DirectionCheckerType, table: MarkInfoMapType) {
    return function(value: MarkInfoType, _: CheckCaseLabels, rowA: number, rowB: number, colA: number, colB: number) {
      let coorA = Game.createKey(rowA, colA);
      let coorB = Game.createKey(rowB, colB);
      
      if(table.get(coorA)?.value !== value.value && dchker[_].isDirecA) {
        dchker[_].isDirecA = false;
      }
  
      if(table.get(coorB)?.value !== value.value && dchker[_].isDirecB) {
        dchker[_].isDirecB = false;
      }
      
      return WinnerFinder.createDirectionCheckResult(
        rowA, colA, coorA, dchker[_].isDirecA,
        rowB, colB, coorB, dchker[_].isDirecB
      );
    }
  }

  /**
   * Use this static method to reset all cases for other uses.
   */
  static reset(dchker: DirectionCheckerType) {
    dchker.A = {
      isDirecA: true,
      isDirecB: true
    };
    dchker.B = {
      isDirecA: true,
      isDirecB: true
    };
    dchker.C = {
      isDirecA: true,
      isDirecB: true
    };
    dchker.D = {
      isDirecA: true,
      isDirecB: true
    };
  }
}

/**
 * Create a winner finder. Each time mark is fill in the MarkInfoMap, checker will check to find winner.
 */
class WinnerFinder {
  // Lock constructor
  private constructor() {}

  /**
   * Use this static method to create WinnerFinder object.
   * @param markInfoMap 
   * @returns 
   */
  static createWinnerFinder(markInfoMap: MarkInfoMapType): WinnerFinderType {
    return {
      markInfoMap: markInfoMap,
      directionChecker: DirectionChecker.createDirectionChecker()
    }
  }

  /**
   * Create a check winner result.
   * @param player 
   * @param from 
   * @param to 
   * @returns 
   */
  static createResult(player: MarkType, from: string, to: string) {
    return {
      player,
      from,
      to
    }
  }

  /**
   * Create direction check result. Can be A, B, C or D case.
   * @param xa 
   * @param ya 
   * @param coorA 
   * @param isDirecA 
   * @param xb 
   * @param yb 
   * @param coorB 
   * @param isDirecB 
   * @returns 
   */
  static createDirectionCheckResult(
    xa: number, ya: number, coorA: string, isDirecA: boolean,
    xb: number, yb: number, coorB: string, isDirecB: boolean
  ): DirectionCheckResultType {
    return [
      { x: xa, y: ya, coor: coorA, isSatisfactory: isDirecA },
      { x: xb, y: yb, coor: coorB, isSatisfactory: isDirecB }
    ];
  }

  /**
   * Use this method to update cases in `directionCheck`.
   * @param $ 
   * @param _ 
   * @param result 
   */
  private static updateCase($: CheckWinnerCaseType, _: CheckCaseLabels, result: DirectionCheckResultType) {
    if(result[0] && result[0].isSatisfactory) {
      $[_]["satisfactionTimes"] += 1;
      $[_]["from"] = result[0].coor;
      $[_]["fromCoor"].x = result[0].x;
      $[_]["fromCoor"].y = result[0].y;
    }
  
    if(result[1] && result[1].isSatisfactory) {
      $[_]["satisfactionTimes"] += 1;
      $[_]["to"] = result[1].coor;
      $[_]["toCoor"].x = result[1].x;
      $[_]["toCoor"].y = result[1].y;
    }
  
    if(result[0].coor === result[1].coor) $[_]["satisfactionTimes"] -= 1;
  }

  /**
   * Use this method to perform last check if "winner" is actually win.
   * @param from 
   * @param to 
   */
  private static boundaryCheck(table: MarkInfoMapType, mark: MarkType, prevFrom: Coordinate, nextTo: Coordinate) {
    let markAtFrom = table.get(Game.createKey(prevFrom.x, prevFrom.y));
    let markAtTo = table.get(Game.createKey(nextTo.x, nextTo.y));

    // If one of marks is undefined, then "winner" is actually win.
    if(!markAtFrom || !markAtTo) return true;

    // If there are different marks at boundaries, that mean "winner" is not win.
    if(
      markAtFrom.value !== mark
      && markAtTo.value !== mark
    ) return false;
    return true;
  }

  /**
   * Use this method to generally check for 4 cases.
   * @param value 
   * @param cases 
   * @param directionCheck 
   * @param c 
   * @param times 
   * @param rowA 
   * @param rowB 
   * @param colA 
   * @param colB 
   * @param callWhenTrue 
   * @returns 
   */
  static check<T extends Function>(
    value: MarkInfoType,
    cases: CheckWinnerCaseType,
    directionCheck: T,
    c: CheckCaseLabels,
    times: number,
    rowA: number, rowB: number, colA: number, colB: number,
    callWhenTrue: () => void
  ) {
    let caseACheck: DirectionCheckResultType = directionCheck(value, c, rowA, rowB, colA, colB);
      
    // Update case `c`
    WinnerFinder.updateCase(cases, c, caseACheck);

    if(times === cases[c].satisfactionTimes) {
      // Set boundary when case `c`
      callWhenTrue();
      return WinnerFinder.createResult(value?.value, cases[c]["from"], cases[c]["to"]);
    }

    return undefined;
  }

  /**
   * This method will check "Who is winner?". Receive `x` and `y` are unit coor.
   * @param row 
   * @param col 
   * @returns 
   */
  static checkWinner(wnfder: WinnerFinderType, row: number, col: number): ResultType | undefined {
    let rCoor = Game.createKey(row, col);
    let table = wnfder.markInfoMap;
    let value = table.get(rCoor);

    if(!value) return undefined;
    
    let cases: CheckWinnerCaseType = {
      A: {
        satisfactionTimes: 0,
        from: "",
        to: "",
        fromCoor: { x: 0, y: 0 },
        toCoor: { x: 0, y: 0 }
      },
      B: {
        satisfactionTimes: 0,
        from: "",
        to: "",
        fromCoor: { x: 0, y: 0 },
        toCoor: { x: 0, y: 0 }
      },
      C: {
        satisfactionTimes: 0,
        from: "",
        to: "",
        fromCoor: { x: 0, y: 0 },
        toCoor: { x: 0, y: 0 }
      },
      D: {
        satisfactionTimes: 0,
        from: "",
        to: "",
        fromCoor: { x: 0, y: 0 },
        toCoor: { x: 0, y: 0 }
      }
    };

    let times = 5;
    let result;
    let directionCheck = DirectionChecker.getDirectionCheck(wnfder.directionChecker, table);
    let boundaryCoors = {
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 }
    };
    let endline = {
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 }
    };
    
    for(let i = 0; i < 5; i++) {
      // Case A
      if(
        (result = this.check(
          value,
          cases,
          directionCheck,
          "A",
          times,
          row, row, col - i, col + i,
          () => {
            // Set boundary when case A
            Game.setCoordinate(boundaryCoors.from, cases["A"].fromCoor.x, cases["A"].fromCoor.y - 1);
            Game.setCoordinate(boundaryCoors.to, cases["A"].toCoor.x, cases["A"].toCoor.y + 1);

            // Set endline
            Game.setCoordinate(endline.from, cases["A"].fromCoor.x + 0.5, cases["A"].fromCoor.y);
            Game.setCoordinate(endline.to, cases["A"].toCoor.x + 0.5, cases["A"].toCoor.y + 1);
          }))
      ) {
        break;
      }

      // Case B
      if(
        (result = this.check(
          value,
          cases,
          directionCheck,
          "B",
          times,
          row - i, row + i, col, col,
          () => {
            // Set boundary when case A
            Game.setCoordinate(boundaryCoors.from, cases["B"].fromCoor.x - 1, cases["B"].fromCoor.y);
            Game.setCoordinate(boundaryCoors.to, cases["B"].toCoor.x + 1, cases["B"].toCoor.y);

            // Set endline
            Game.setCoordinate(endline.from, cases["B"].fromCoor.x, cases["B"].fromCoor.y + 0.5);
            Game.setCoordinate(endline.to, cases["B"].toCoor.x + 1, cases["B"].toCoor.y + 0.5);
          }))
      ) {
        break;
      }

      // Case C
      if(
        (result = this.check(
          value,
          cases,
          directionCheck,
          "C",
          times,
          row - i, row + i, col - i, col + i,
          () => {
            // Set boundary when case C
            Game.setCoordinate(boundaryCoors.from, cases["C"].fromCoor.x - 1, cases["C"].fromCoor.y - 1);
            Game.setCoordinate(boundaryCoors.to, cases["C"].toCoor.x + 1, cases["C"].toCoor.y + 1);

            // Set endline
            Game.setCoordinate(endline.from, cases["C"].fromCoor.x, cases["C"].fromCoor.y);
            Game.setCoordinate(endline.to, cases["C"].toCoor.x + 1, cases["C"].toCoor.y + 1);
          }))
      ) {
        break;
      }

      // Case D
      if(
        (result = this.check(
          value,
          cases,
          directionCheck,
          "D",
          times,
          row - i, row + i, col + i, col - i,
          () => {
            // Set boundary when case D
            Game.setCoordinate(boundaryCoors.from, cases["D"].fromCoor.x - 1, cases["D"].fromCoor.y + 1);
            Game.setCoordinate(boundaryCoors.to, cases["D"].toCoor.x + 1, cases["D"].toCoor.y - 1);

            // Set endline
            Game.setCoordinate(endline.from, cases["D"].fromCoor.x, cases["D"].fromCoor.y + 1);
            Game.setCoordinate(endline.to, cases["D"].toCoor.x + 1, cases["D"].toCoor.y);

          }))
      ) {
        break;
      }
    }

    // Reset
    DirectionChecker.reset(wnfder.directionChecker);
    
    if(result && !this.boundaryCheck(table, value.value, boundaryCoors.from, boundaryCoors.to)) {
      return undefined;
    }

    if(result) {
      return { ...result, endline };
    };

    return undefined;
  }
}

/**
 * Use this game to create an object that can manage Game in app.
 */
export class Game {
  static MarkInfoKeyPattern = /\((\d+),(\d+)\)/;
  /**
   * `less` define size of "square" around Circle (O) and Path (X).
   */
  static less = 5;
  /**
   * `t` is a variable that is used to define "How big is a square?".
   */
  static t = 30;

  // Lock constructor
  private constructor() {}

  /**
   * Use this static method to create a Game object.
   * @param id 
   * @param name 
   * @returns 
   */
  static createGame(id: string, name: string): GameType {
    // Init game.
    let newGame = Game.init({} as GameType);

    newGame.id = id;
    newGame.name = name;
    newGame.status = "Waiting";
    newGame.host = null;
    newGame._players = {
      "first": null,
      "second": null
    };
    newGame._password = null;

    return newGame;
  }

  /**
   * Use to create key for `MarkInfoMap`.
   * @param unitCoorX 
   * @param unitCoorY 
   * @returns 
   */
  static createKey(unitCoorX: number, unitCoorY: number) {
    return `(${unitCoorX},${unitCoorY})`;
  }

  /**
   * Use to set coordinate.
   * @param o 
   * @param x 
   * @param y 
   * @returns 
   */
  static setCoordinate(o: Coordinate, x: number, y: number) {
    o.x = x;
    o.y = y;
    return o;
  }

  /**
   * Use this static method to get d string for path to draw "X".
   * @param unitCoorX 
   * @param unitCoorY 
   * @param t 
   * @param less
   * @returns 
   */
  static createPathDForX(unitCoorX: number, unitCoorY: number, t: number, less: number) {
    let coorX = unitCoorX * t;
    let coorY = unitCoorY * t;
    let topLeft = `${coorX + less},${coorY + less}`;
    let topRight = `${coorX + t - less},${coorY + less}`;
    let bottomLeft = `${coorX + less},${coorY + t - less}`;
    let bottomRight = `${coorX + t - less},${coorY + t - less}`;

    return `M ${topLeft} L ${bottomRight}  M ${topRight}  L ${bottomLeft}`;
  }

  /**
   * Use this static method to get coordinate from key.
   * @param key 
   * @returns 
   */
  static getCoordinateFromKey(key: string): Array<number> {
    let result = key.match(Game.MarkInfoKeyPattern) as Array<string>;
    return [parseInt(result[1]), parseInt(result[2])];
  }

  /**
   * Use this static method to iterate players.
   * @param o 
   * @param cb 
   */
  static iteratePlayers(game: GameType, cb: (player: PlayerType, index: number) => void) {
    let players = Game.getPlayers(game, true) as (Array<PlayerType>);
    let index = 0;
    for(let player of players) {
      cb(player, index);
      index++;
    }
  }

  /**
   * Use this static method to init a game.
   * @param game 
   */
  static init(game: GameType) {
    game.currentTurn = "X";
    game._markInfoMap = new MyMap() as MarkInfoMapType;
    game._winnerFinder = WinnerFinder.createWinnerFinder(game._markInfoMap);

    return game;
  }

  /**
   * Use this static method to clear some properties.
   * @param game 
   */
  static clear(game: GameType) {
    game._players = null;
    game._markInfoMap = null;
    game._winnerFinder = null;
  }

  /*
    SETTERS
  */
 /**
  * Use this static method to set password for game.
  * @param game 
  * @param password 
  */
  static setPassword(game: GameType, password: string) {
    game._password = password;
  }

  /**
   * Use this static method to set player.
   * @param game 
   * @param key 
   * @param player 
   * @returns 
   */
  static setPlayer(game: GameType, key: PlayersKeyType, player: PlayerType) {
    if(!game._players) return;

    // Always init for game.
    Player.initForGame(player);

    game._players[key] = player;
  }

  /**
   * Use this static method to set turn.
   * @param game 
   * @param turn 
   */
  static setTurn(game: GameType, turn: MarkType) {
    game.currentTurn = turn;
  }

  /**
   * Use this static method to set winner.
   * @param game 
   * @param key 
   * @returns 
   */
  static setWinner(game: GameType, key: string) {
    if(!game._players) return;

    Game.iteratePlayers(game, player => {
      if(player.mark === key) {
        player.score += 1;
        player.isWinner = true;
      }
    });
  }

  /**
   * Use this static method to set host for game.
   * @param game 
   * @param player 
   */
  static setHost(game: GameType, player: PlayerType): any;
  static setHost(game: GameType, key: string): any;
  static setHost(game: GameType, g: PlayerType | string) {
    if(!game._players) return;

    if(typeof g === "string") {
      game.host = game._players[g]!;
      return;
    }

    game.host = g;
  }

  /*
    GETTERS
  */
  /**
   * Use this static method to get password.
   * @param game 
   * @returns 
   */
  static getPassword(game: GameType) {
    return game._password;
  }

  /**
   * Use this static method to get player.
   * @param game 
   * @param key 
   * @returns 
   */
  static getPlayer(game: GameType, key: PlayersKeyType) {
    if(!game._players) return;
    return game._players[key];
  }

  /**
   * Use this static method to get player by id.
   * @param game 
   * @param playerId 
   * @returns 
   */
  static getPlayerById(game: GameType, playerId: string) {
    let players = Game.getPlayers(game, true) as Array<PlayerType>;

    return players.find(player => {
      if(player) return player.id === playerId;
      else return false;
    });
  }

  /**
   * Use this static method to get the player whose `id` does not match with `playerId`.
   * @param game 
   * @param playerId 
   * @returns 
   */
  static getPlayerByExceptedId(game: GameType, playerId: string) {
    let players = Game.getPlayers(game, true) as Array<PlayerType>;

    return players.find(player => {
      if(player) return player.id !== playerId;
      else return false;
    });
  }

  /**
   * Use this static method to get information of player by `name`.
   * @param game 
   * @param name 
   * @returns 
   */
  static getPlayerByName(game: GameType, name: string) {
    if(!game._players) return undefined;

    let players = Game.getPlayers(game, true) as Array<PlayerType>;

    return players.find(player => {
      if(player) return player.name === name;
      else return false;
    });
  }

  /**
   * Use this static method to get ordinal number of player in `_players`.
   * @param game 
   * @param playerId 
   * @returns 
   */
  static getPlayerONumById(game: GameType, playerId: string) {
    let target = "second";

    // Find
    Game.iteratePlayers(game, (player, index) => {
      if(player && player.id === playerId) target = index === 0 ? "first" : "second"
    });

    return target;
  }

  /**
   * Use this static method to get non-host player.
   * @param game 
   * @returns 
   */
  static getNonHostPlayer(game: GameType) {
    if(!game._players) return;
    let players = Game.getPlayers(game, true) as Array<PlayerType>;
    return players.find(player => {
      if(player) return player === game.host;
      else return false;
    });
  }

  /**
   * Use this static method to get all players.
   * @param game 
   * @param isArray 
   * @returns 
   */
  static getPlayers(game: GameType, isArray: boolean = false) {
    if(isArray) {
      let result: Array<any> = [];
      if(!game._players) return result;

      // Check if `first` player is exist.
      if(game._players["first"]) {
        result.push(game._players["first"]);
      }

      // Check if `second` player is exist.
      if(game._players["second"]) {
        result.push(game._players["second"]);
      }
      return result;

    }

    if(!game._players) return {};

    return game._players!;
  }

  /*
    OTHER METHODS
  */
  /**
   * Use this static method to remove a player by `id` or `mark`.
   * @param game 
   * @param playerId 
   */
  static removePlayer(game: GameType, playerId: string): any;
  static removePlayer(game: GameType, key: PlayersKeyType): any;
  static removePlayer(game: GameType, g: PlayersKeyType | string) {
    if(!game._players) return;
    if(game._players[g]) { delete game._players[g]; return; };

    if(game._players["first"] && game._players["first"].id === g) {
      delete game._players["first"];
    } else if(game._players["second"] && game._players["second"].id === g) {
      delete game._players["second"];
    }
  }

  /**
   * Use this static method with a callback with this function to render marks to JSX.Element.
   * @param game 
   * @param fn 
   * @returns 
   */
  static renderMarks(game: GameType, fn: (value: MarkInfoType | undefined, key?: string) => JSX.Element) {
    return game._markInfoMap!.map(fn);
  }

  /**
   * Use this static method to add an information of mark to map.
   * @param game 
   * @param coordinate 
   * @param mark 
   * @param element 
   */
  static addMarkInfo(game: GameType, coordinate: string, mark: MarkType, element: JSX.Element) {
    if(!game._markInfoMap!.get(coordinate))
      game._markInfoMap!.set(coordinate, { value: mark, element });
  }

  /**
   * Use this static method to compare password.
   * @param game 
   * @param password 
   * @returns 
   */
  static comparePassword(game: GameType, password: string) {
    return game._password === password;
  }

  /**
   * Use this static method to check if this unit coordinate has any mark. Return boolean.
   * @param game 
   * @param unitCoorX 
   * @param unitCoorY 
   * @returns 
   */
  static hasMarkIn(game: GameType, unitCoorX: number, unitCoorY: number) {
    return Boolean(game._markInfoMap!.get(Game.createKey(unitCoorX, unitCoorY)));
  }

  /**
   * Use this static method to check "Is game complete?" or "Has winner?"
   * @param game 
   * @returns 
   */
  static hasWinner(game: GameType) {
    if(!game._players) return false;
    let result = (Game.getPlayers(game, true) as Array<PlayerType>).some(player => {
      if(player) return player.isWinner;
      return false;
    });

    return result;
  }

  /**
   * Use this static method to reset entire the state of game.
   * @param game 
   * @returns 
   */
  static reset(game: GameType) {
    if(!game._players) return;

    if(game._players["first"]) Player.reset(game._players["first"]);
    if(game._players["second"]) Player.reset(game._players["second"]);

    Game.startNewRound(game);
  }

  /**
   * Use this static method to start new game.
   * @param game 
   * @returns 
   */
  static startNewRound(game: GameType) {
    if(!game._players) return;

    if(game._players["first"]) game._players["first"].isWinner = false;
    if(game._players["second"]) game._players["second"].isWinner = false;

    return Game.init(game);
  }

  /**
   * Use this static method to get user's information.
   * @param game 
   * @param key 
   * @returns 
   */
  static getPlayerInformation(game: GameType, key: PlayersKeyType) {
    if(!game._players) return;
    return game._players![key];
  }

  // FIND WINNER
  /**
   * Use this static method to find winner. If game has winner,
   * this will return `ResultType` else return `undefined`.
   * @param game 
   * @param row 
   * @param col 
   * @returns 
   */
  static findWinner(game: GameType, row: number, col: number) {
    return WinnerFinder.checkWinner(game._winnerFinder!, row, col);
  }
}