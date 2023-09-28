import React from 'react';

function getState<T, N extends keyof T>(state: T, name: N, fn: (data: T[N]) => T[N]) {
  return {...state, [name]: fn(state[name])};
}

/**
 * This hook allow using state and generate some explicit funtions that use `setState` inside.
 * The purpose of this hook is for clearer `setState` actions and centralize state of components.
 * 
 * __WESSFns__ in `useStateWESSFns` stand for __With Explicit SetState Functions__
 * @param state 
 * @returns 
 */
export function useStateWESSFns<T, O>(
  state: T,
  build: (changeState: <N extends keyof T>(name: N, fn: (data: T[N]) => T[N], preventUpdate?: (data: T[N]) => boolean) => void) => O
) {
  // Get state and setState
  const [$, set$] = React.useState<T>(state);

  // Get ESSFns from React.useMemo()
  const _fns = React.useMemo(() => {
    // Create `changeState` function.
    const $ = function<N extends keyof T>(name: N, fn: (data: T[N]) => T[N], preventUpdate?: (data: T[N]) => boolean) {
      set$(
        prevState => {
          if(preventUpdate && preventUpdate(fn(prevState[name]))) return prevState;
          return getState(prevState, name, fn);
        }
      );
    }

    // Use build() to get object that contains functions for component use.
    return build($);
  }, []);

  return [$, _fns] as const;
}