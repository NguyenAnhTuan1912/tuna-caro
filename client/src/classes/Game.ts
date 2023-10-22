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
  host?: Player;
  _password: string;
  _players: { [key: string]: PlayerType } | null;
};

export interface GameRoomType {
  id: string;
  playerName: string;
  name: string;
  status: GameStatus;
  hasPassword: boolean;
}

/**
 * Create a direction checker. Each case has 2 directions to check.
 */
class DirectionChecker {
  private A!: {
    isDirecA: boolean;
    isDirecB: boolean;
  };
  private B!: {
    isDirecA: boolean;
    isDirecB: boolean;
  };
  private C!: {
    isDirecA: boolean;
    isDirecB: boolean;
  };
  private D!: {
    isDirecA: boolean;
    isDirecB: boolean;
  }

  constructor() {
    this.A = {
      isDirecA: true,
      isDirecB: true
    };
    this.B = {
      isDirecA: true,
      isDirecB: true
    };
    this.C = {
      isDirecA: true,
      isDirecB: true
    };
    this.D = {
      isDirecA: true,
      isDirecB: true
    };
  }

  /**
   * Use this method to get a direction checker. Each case has 2 direction to check.
   * If one of these direction is not satisfy the condition, checker will stop check this direction.
   * @param table 
   * @returns 
   */
  getDirectionCheck(table: MarkInfoMapType) {
    let that = this;
    return function(value: MarkInfoType, _: CheckCaseLabels, rowA: number, rowB: number, colA: number, colB: number) {
      let coorA = Game.createKey(rowA, colA);
      let coorB = Game.createKey(rowB, colB);
      
      if(table.get(coorA)?.value !== value.value && that[_].isDirecA) {
        that[_].isDirecA = false;
      }
  
      if(table.get(coorB)?.value !== value.value && that[_].isDirecB) {
        that[_].isDirecB = false;
      }
      
      return WinnerFinder.createDirectionCheckResult(
        rowA, colA, coorA, that[_].isDirecA,
        rowB, colB, coorB, that[_].isDirecB
      );
    }
  }

  /**
   * Use this method to reset all cases for other uses.
   */
  reset() {
    this.A = {
      isDirecA: true,
      isDirecB: true
    };
    this.B = {
      isDirecA: true,
      isDirecB: true
    };
    this.C = {
      isDirecA: true,
      isDirecB: true
    };
    this.D = {
      isDirecA: true,
      isDirecB: true
    };
  }
}

/**
 * Create a winner finder. Each time mark is fill in the MarkInfoMap, checker will check to find winner.
 */
class WinnerFinder {
  markInfoMap!: WeakRef<MarkInfoMapType>;
  directionChecker!: DirectionChecker;

  constructor(markInfoMap: MarkInfoMapType) {
    this.markInfoMap = new WeakRef(markInfoMap);
    this.directionChecker = new DirectionChecker();
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
  private updateCase($: CheckWinnerCaseType, _: CheckCaseLabels, result: DirectionCheckResultType) {
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
  private boundaryCheck(table: MarkInfoMapType, mark: MarkType, prevFrom: Coordinate, nextTo: Coordinate) {
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
  check<T extends Function>(
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
    this.updateCase(cases, c, caseACheck);

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
  checkWinner(row: number, col: number): ResultType | undefined {
    let rCoor = Game.createKey(row, col);
    let table = this.markInfoMap.deref()!
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
    let directionCheck = this.directionChecker.getDirectionCheck(table);
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
    this.directionChecker.reset();
    
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
  id!: string;
  name!: string;
  status!: GameStatus;
  currentTurn!: MarkType;
  host!: Player;
  
  private _password?: string;
  private _players!: { [key: string]: PlayerType | null } | null;
  private _markInfoMap!: MarkInfoMapType | null;
  private _winnerFinder!: WinnerFinder | null;

  static MarkInfoKeyPattern = /\((\d+),(\d+)\)/;
  /**
   * `less` define size of "square" around Circle (O) and Path (X).
   */
  static less = 5;
  /**
   * `t` is a variable that is used to define "How big is a square?".
   */
  static t = 30;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.status = "Waiting";
    this._players = {
      "first": null,
      "second": null
    };

    // Init something
    this.init();
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
  static iteratePlayers(o: Game, cb: (player: PlayerType, index: number) => void) {
    let players = o.getPlayers(true) as (Array<PlayerType>);
    let index = 0;
    for(let player of players) {
      cb(player, index);
      index++;
    }
  }

  /**
   * Use this method to init game's state.
   */
  init() {
    this.currentTurn = "X";
    this._markInfoMap = new MyMap();
    this._winnerFinder = new WinnerFinder(this._markInfoMap);
  }

  // Use to clear some properties.
  clear() {
    this._players = null;
    this._markInfoMap = null;
    this._winnerFinder = null;
  }

  /*
    SETTERS
  */
  setPassword(password: string) {
    this._password = password;
  }

  /**
   * Use this method to set player.
   * @param turn 
   * @param player 
   */
  setPlayer(key: PlayersKeyType, player: PlayerType) {
    if(!this._players) return;

    // Always init for game.
    Player.initForGame(player);

    this._players[key] = player;
  }

  /**
   * Use this method to set turn.
   * @param turn 
   */
  setTurn(turn: MarkType) {
    this.currentTurn = turn;
  }

  /**
   * Use this method to set winner.
   * @param mark 
   */
  setWinner(key: string) {
    if(!this._players) return;

    Game.iteratePlayers(this, player => {
      if(player.mark === key) {
        player.score += 1;
        player.isWinner = true;
      }
    });
  }

  /**
   * Use this method to set host for game.
   * @param player
   */
  setHost(player: Player): any;
  setHost(key: string): any;
  setHost(g: Player | string) {
    if(!this._players) return;

    if(typeof g === "string") {
      this.host = this._players[g]!;
      return;
    }

    this.host = g;
  }

  /*
    GETTERS
  */
 /**
  * Use this method to get password.
  * @returns 
  */
  getPassword() {
    return this._password;
  }

  /**
   * Use this method to get player.
   * @param turn 
   * @returns 
   */
  getPlayer(key: PlayersKeyType) {
    if(!this._players) return;
    return this._players[key];
  }

  /**
   * Use this method to get player by id;
   * @param playerId 
   */
  getPlayerById(playerId: string) {
    let players = this.getPlayers(true) as Array<PlayerType>;

    return players.find(player => {
      if(player) return player.id === playerId;
      else return false;
    });
  }

  /**
   * Use this method to get the player whose `id` does not match with `playerId`.
   * @param playerId 
   */
  getPlayerByExceptedId(playerId: string) {
    let players = this.getPlayers(true) as Array<PlayerType>;

    return players.find(player => {
      if(player) return player.id !== playerId;
      else return false;
    });
  }

  /**
   * Use this method to get information of player by `name`.
   * @param name 
   * @returns 
   */
  getPlayerByName(name: string) {
    if(!this._players) return undefined;

    let players = this.getPlayers(true) as Array<PlayerType>;

    return players.find(player => {
      if(player) return player.name === name;
      else return false;
    });
  }

  /**
   * Use this method to get ordinal number of player in `_players`.
   * @param playerId 
   */
  getPlayerONumById(playerId: string) {
    let target = "second";

    // Find
    Game.iteratePlayers(this, (player, index) => {
      if(player && player.id === playerId) target = index === 0 ? "first" : "second"
    });

    return target;
  }

  /**
   * Use this method to get non-host player.
   */
  getNonHostPlayer() {
    if(!this._players) return;
    let players = this.getPlayers(true) as Array<PlayerType>;
    return players.find(player => {
      if(player) return player === this.host;
      else return false;
    });
  }

  /**
   * Use this method to get all players.
   * @param isArray
   */
  getPlayers(isArray: boolean = false) {
    if(isArray) {
      let result: Array<any> = [];
      if(!this._players) return result;

      // Check if `first` player is exist.
      if(this._players["first"]) {
        result.push(this._players["first"]);
      }

      // Check if `second` player is exist.
      if(this._players["second"]) {
        result.push(this._players["second"]);
      }
      return result;

    }

    if(!this._players) return {};

    return this._players!;
  }

  /*
    OTHER METHODS
  */
 /**
  * Use this method to remove a player by `id` or `mark`.
  * @param playerId 
  */
  removePlayer(playerId: string): any;
  removePlayer(key: PlayersKeyType): any;
  removePlayer(g: PlayersKeyType | string) {
    if(!this._players) return;
    if(this._players[g]) { delete this._players[g]; return; };

    if(this._players["first"] && this._players["first"].id === g) {
      delete this._players["first"];
    } else if(this._players["second"] && this._players["second"].id === g) {
      delete this._players["second"];
    }
  }

  /**
   * Use a callback with this function to render marks to JSX.Element.
   * @param fn 
   * @returns 
   */
  renderMarks(fn: (value: MarkInfoType | undefined, key?: string) => JSX.Element) {
    return this._markInfoMap!.map(fn);
  }

  /**
   * Use this method to add an information of mark to map.
   * @param coordinate 
   * @param mark 
   * @param element 
   */
  addMarkInfo(coordinate: string, mark: MarkType, element: JSX.Element) {
    if(!this._markInfoMap!.get(coordinate))
      this._markInfoMap!.set(coordinate, { value: mark, element });
  }

  /**
   * Use this method to compare password.
   * @param password 
   * @returns 
   */
  comparePassword(password: string) {
    return this._password === password;
  }

  /**
   * Use to check if this unit coordinate has any mark. Return boolean.
   * @param unitCoorX 
   * @param unitCoorY 
   * @returns 
   */
  hasMarkIn(unitCoorX: number, unitCoorY: number) {
    return Boolean(this._markInfoMap!.get(Game.createKey(unitCoorX, unitCoorY)));
  }

  /**
   * Use to check "Is game complete?" or "Has winner?"
   */
  hasWinner() {
    if(!this._players) return false;
    let result = (this.getPlayers(true) as Array<PlayerType>).some(player => {
      if(player) return player.isWinner;
      return false;
    });

    return result;
  }

  /**
   * Use this method to reset entire the state of game.
   */
  reset() {
    if(!this._players) return;

    if(this._players["first"]) Player.reset(this._players["first"]);
    if(this._players["second"]) Player.reset(this._players["second"]);

    this.startNewRound();
  }

  /**
   * Use this method to start new game.
   */
  startNewRound() {
    if(!this._players) return;

    if(this._players["first"]) this._players["first"].isWinner = false;
    if(this._players["second"]) this._players["second"].isWinner = false;

    this.init();
  }

  /**
   * Use this method to get user's information.
   * @param key 
   * @returns 
   */
  getPlayerInformation(key: PlayersKeyType) {
    if(!this._players) return;
    return this._players![key];
  }

  // FIND WINNER
  /**
   * Use to find winner. If game has winner, this will return `ResultType` else return `undefined`.
   * @param row 
   * @param col 
   */
  findWinner(row: number, col: number) {
    return this._winnerFinder?.checkWinner(row, col);
  }
}