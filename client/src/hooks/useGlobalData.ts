import React from "react";

// Import classes
import { GameType } from "src/classes/Game";

export interface GlobalDataType {
  game: GameType | null
};

/**
 * Use this function to change data.
 * @param data 
 * @param name 
 * @param fn 
 */
function changeData<N extends keyof GlobalDataType>(
  data: React.MutableRefObject<GlobalDataType>,
  name: N,
  fn: (data: GlobalDataType[N]) => GlobalDataType[N]
) {
  data.current[name] = fn(data.current[name]);
}

/**
 * Use this hook to access to global data of app. Global Data has the same idea
 * with Redux (where we can store STATE). But this hook stores NON-STATE.
 */
export function useGlobalData() {
  const data = React.useRef<GlobalDataType>({
    game: null
  });

  return {
    data: data.current,
    changeData: function<N extends keyof GlobalDataType>(name: N, fn: (data: GlobalDataType[N]) => GlobalDataType[N]) {
      changeData(data, name, fn);
    }
  }
}