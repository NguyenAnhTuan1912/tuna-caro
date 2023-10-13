import React from "react";

// Import classes
import { gpd } from "src/classes/GlobalPrivateData";

/**
 * Use this hook to access to global data of app. Global Data has the same idea
 * with Redux (where we can store STATE). But this hook stores NON-STATE.
 */
export function useGlobalData() {
  return React.useMemo(() => {
    return gpd;
  }, []);
}