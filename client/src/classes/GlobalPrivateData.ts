// Import classes
import { GameType } from "src/classes/Game";

export interface GlobalDataType {
  game: GameType | null
};

const __privateData__: GlobalDataType = {
  game: null
}
let __privateInstance_: GlobalPrivateData | null = null;

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
 * Use this function to get private global data.
 */
export class GlobalPrivateData {
  constructor() {
    if(__privateInstance_) return __privateInstance_;

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

if(!__privateInstance_) __privateInstance_ = new GlobalPrivateData();

export const gpd = new GlobalPrivateData();