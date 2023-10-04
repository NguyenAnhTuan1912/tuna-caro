import { MyMap } from "src/objects/MyMap";
import { Player } from "./Player";

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
  isDirecA!: boolean;
  isDirecB!: boolean;

  constructor() {
    this.isDirecA = true;
    this.isDirecB = true;
  }

  /**
   * Use this method to get a direction checker. Each case has 2 direction to check.
   * If one of these direction is not satisfy the condition, checker will stop check this direction.
   * @param table 
   * @returns 
   */
  getDirectionChecker(table: MarkInfoMapType) {
    let that = this;
    return function(value: MarkInfoType, rowA: number, rowB: number, colA: number, colB: number) {
      let coorA = Game.createKey(rowA, colA);
      let coorB = Game.createKey(rowB, colB);
      
      if(table.get(coorA)?.value !== value.value && that.isDirecA) {
        that.isDirecA = false;
      }
  
      if(table.get(coorB)?.value !== value.value && that.isDirecB) {
        that.isDirecB = false;
      }
      
      return WinnerFinder.createDirectionCheckResult(coorA, that.isDirecA, coorB, that.isDirecB);
    }
  }

  /**
   * Reset directions for other cases.
   */
  reset() {
    this.isDirecA = true;
    this.isDirecB = true;
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
      }
    };

    let times = 5;
    let directionChecker = this.directionChecker.getDirectionChecker(table);
    
    for(let i = 0; i < 5; i++) {
      // Case A
      let caseACheck = directionChecker(value, row, row, col - i, col + i);
      
      // Update case A
      this.updateCase(cases, "A", caseACheck);

      if(times === cases["A"].satisfactionTimes) {
        return WinnerFinder.createResult(value?.value, cases["A"]["from"], cases["A"]["to"]);
      }
      // Reset for resuse in other cases.
      this.directionChecker.reset();

      // Case B

      // Case C

      // Case D
    }
    
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
  
  private password?: string;
  private players!: { [key: string]: Player } | null;
  private markInfoMap!: MarkInfoMapType | null;
  private winnerFinder!: WinnerFinder | null;

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

  setWiner(mark: MarkType) {
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
   * Use to create key for `MarkInfoMap`.
   * @param unitCoorX 
   * @param unitCoorY 
   * @returns 
   */
  static createKey(unitCoorX: number, unitCoorY: number) {
    return `(${unitCoorX},${unitCoorY})`;
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