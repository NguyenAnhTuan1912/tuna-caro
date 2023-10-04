import { MyMap } from "src/objects/MyMap";
import { Player } from "./Player";

export type Coordinate = {
  x: number;
  y: number;
};
export type GameStatus = "Waiting" | "Playing";
export type MarkType = "X" | "O";
export type MarkInfoMapType = MyMap<string, MarkInfoType>;
export interface MarkInfoType {
  value: MarkType;
  element: JSX.Element;
}
export type CheckCaseLabels = "A" | "B" | "C" | "D";
export interface CheckWinnerCaseType {
  [Key: string]: {
    satisfactionTimes: number,
    from: string,
    to: string
  }
}
export interface ResultType {
  player: Player;
  from: string;
  to: string;
}
export type DirectionCheckResultType = Array<{
  coor: string;
  isSatisfactory: boolean;
}>;

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
      
      return WinnerFinder.createDirectionCheckResult(coorA, that[_].isDirecA, coorB, that[_].isDirecB);
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
   * @param coorA 
   * @param isDrtA 
   * @param coorB 
   * @param isDrtB 
   * @returns 
   */
  static createDirectionCheckResult(coorA: string, isDirecA: boolean, coorB: string, isDirecB: boolean): DirectionCheckResultType {
    return [
      { coor: coorA, isSatisfactory: isDirecA },
      { coor: coorB, isSatisfactory: isDirecB }
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
    }
  
    if(result[1] && result[1].isSatisfactory) {
      $[_]["satisfactionTimes"] += 1;
      $[_]["to"] = result[1].coor;
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
    ) {
      console.log("Not win bro!");
      return false;
    };
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
    let caseACheck = directionCheck(value, c, rowA, rowB, colA, colB);
      
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
   * This method will check "Who is winner?". The process will be:
   * @param row 
   * @param col 
   * @returns 
   */
  checkWinner(row: number, col: number) {
    let rCoor = Game.createKey(row, col);
    let table = this.markInfoMap.deref()!
    let value = table.get(rCoor);

    if(!value) return undefined;
    
    let cases: CheckWinnerCaseType = {
      A: {
        satisfactionTimes: 0,
        from: "",
        to: ""
      },
      B: {
        satisfactionTimes: 0,
        from: "",
        to: ""
      },
      C: {
        satisfactionTimes: 0,
        from: "",
        to: ""
      },
      D: {
        satisfactionTimes: 0,
        from: "",
        to: ""
      }
    };

    let times = 5;
    let result;
    let directionCheck = this.directionChecker.getDirectionCheck(table);
    let boundaryCoors = {
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
            Game.setCoordinate(boundaryCoors.from, row, col - i - 1);
            Game.setCoordinate(boundaryCoors.to, row, col + 1);
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
            Game.setCoordinate(boundaryCoors.from, row - i - 1, col);
            Game.setCoordinate(boundaryCoors.to, row + 1, col);
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
            // Set boundary when case A
            Game.setCoordinate(boundaryCoors.from, row - i - 1, col - i - 1);
            Game.setCoordinate(boundaryCoors.to, row + 1, col + 1);
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
            // Set boundary when case A
            Game.setCoordinate(boundaryCoors.from, row - i - 1, col + i + 1);
            Game.setCoordinate(boundaryCoors.to, row + 1, col - 1);
          }))
      ) {
        break;
      }

      // Reset
      this.directionChecker.reset();
    }
    
    if(result && !this.boundaryCheck(table, value.value, boundaryCoors.from, boundaryCoors.to)) {
      return undefined;
    }

    return result;
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
  
  private password?: string;
  private players!: { [key: string]: Player } | null;
  private markInfoMap!: MarkInfoMapType | null;
  private winnerFinder!: WinnerFinder | null;

  static MarkInfoKeyPattern = /\((\d+),(\d+)\)/;

  constructor(id: string, name: string, player1: Player, player2: Player) {
    this.id = id;
    this.name = name;
    this.status = "Waiting";
    this.players = {
      "X": player1,
      "O": player2
    };
    this.currentTurn = "X";
    this.markInfoMap = new MyMap();
    this.winnerFinder = new WinnerFinder(this.markInfoMap);
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

  // Use to clear some properties.
  clear() {
    this.players = null;
    this.markInfoMap = null;
    this.winnerFinder = null;
  }

  /*
    SETTERS
  */
  setPassword(password: string) {
    this.password = password;
  }

  setPlayer(turn: string, player: Player) {
    player.setMark(turn);
    if(!this.players![turn]) this.players![turn] = player;
  }

  setTurn(turn: MarkType) {
    this.currentTurn = turn;
  }

  setWinner(mark: MarkType) {
    this.players![mark].isWinner = true;
  }

  /*
    GETTERS
  */
  getPassword() {
    return this.password;
  }

  getPlayer(turn: MarkType) {
    return this.players![turn];
  }

  /**
   * Use a callback with this function to render marks to JSX.Element.
   * @param fn 
   * @returns 
   */
  renderMarks(fn: (value: MarkInfoType | undefined, key?: string) => JSX.Element) {
    return this.markInfoMap!.map(fn);
  }

  /**
   * Use this method to add an information of mark to map.
   * @param coordinate 
   * @param mark 
   * @param element 
   */
  addMarkInfo(coordinate: string, mark: MarkType, element: JSX.Element) {
    if(!this.markInfoMap!.get(coordinate))
      this.markInfoMap!.set(coordinate, { value: mark, element });
  }

  /**
   * Use this method to compare password.
   * @param password 
   * @returns 
   */
  comparePassword(password: string) {
    return this.password === password;
  }

  /**
   * Use this method to get d string for path to draw "X".
   * @param unitCoorX 
   * @param unitCoorY 
   * @param t 
   * @param less
   * @returns 
   */
  createPathDForX(unitCoorX: number, unitCoorY: number, t: number, less: number) {
    let coorX = unitCoorX * t;
    let coorY = unitCoorY * t;
    let topLeft = `${coorX + less},${coorY + less}`;
    let topRight = `${coorX + t - less},${coorY + less}`;
    let bottomLeft = `${coorX + less},${coorY + t - less}`;
    let bottomRight = `${coorX + t - less},${coorY + t - less}`;

    return `M ${topLeft} L ${bottomRight}  M ${topRight}  L ${bottomLeft} `;
  }

  /**
   * Use to check if this unit coordinate has any mark. Return boolean.
   * @param unitCoorX 
   * @param unitCoorY 
   * @returns 
   */
  hasMarkIn(unitCoorX: number, unitCoorY: number) {
    return Boolean(this.markInfoMap!.get(Game.createKey(unitCoorX, unitCoorY)));
  }

  /**
   * Use to check "Is game complete?" or "Has winner?"
   */
  hasWinner() {
    if(this.players!["X"].isWinner) return true;
    if(this.players!["O"].isWinner) return true;
    return false;
  }

  // FIND WINNER
  /**
   * Use to find winner. If game has winner, this will return `ResultType` else return `undefined`.
   * @param row 
   * @param col 
   */
  findWinner(row: number, col: number) {
    return this.winnerFinder?.checkWinner(row, col);
  }
}