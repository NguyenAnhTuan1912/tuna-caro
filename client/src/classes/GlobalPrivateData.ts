// Import classes
import { GameType } from "src/classes/Game";

export interface GlobalDataType {
  game: GameType | null;
  maxDisconnectionDuration: number;
};
export type ChangeDataFnType = <N extends keyof GlobalDataType>(name: N, fn: (data: GlobalDataType[N]) => GlobalDataType[N]) => void

const __privateData__: GlobalDataType = {
  game: null,
  maxDisconnectionDuration: 0
}
let __privateInstance__: GlobalPrivateData | null = null;

/**
 * Use this function to change data.
 * @param data 
 * @param name 
 * @param fn 
 */
function __changeData__<N extends keyof GlobalDataType>(
  data: GlobalDataType,
  name: N,
  fn: (data: GlobalDataType[N]) => GlobalDataType[N]
) {
  data[name] = fn(data[name]);
}

/**
 * __Singleton class__
 * 
 * Get singleton instance from this class and access to global data.
 */
export class GlobalPrivateData {
  constructor() {
    if(__privateInstance__) return __privateInstance__;

    this.changeData = this.changeData.bind(this);
    this.getData = this.getData.bind(this);
  }

  /**
   * Use this method to get private data.
   * @returns 
   */
  getData() {
    return __privateData__;
  }

  /**
   * Use this method to set data.
   * @param name 
   * @param fn 
   */
  changeData<N extends keyof GlobalDataType>(name: N, fn: (data: GlobalDataType[N]) => GlobalDataType[N]) {
    __changeData__(__privateData__, name, fn);
  }
}

if(!__privateInstance__) __privateInstance__ = new GlobalPrivateData();

export const gpd = new GlobalPrivateData();