import { ChangeStateFnType } from "src/hooks/useStateWESSFns";

/**
 * Use this function to get the initial state for `ProfileCard`.
 * @returns 
 */
function getInitialState() {
  return {
    canChangeName: false
  }
}

/**
 * Use this function to get all `set state` functions of `ProfileCard`.
 * Including:
 * - `addCharacters`: add characters to list.
 * - `clearCharacter`: clear all character in list (to empty array).
 * - `setChoice`: modify `choice`.
 * @param changeState 
 * @returns 
 */
function getStateFns(changeState: ChangeStateFnType<ReturnType<typeof getInitialState>>) {
  return {
    /**
     * Use this function to enable of disable player name text box.
     * @param s
     */
    toggleChangeName: function(s?: boolean) {
      changeState("canChangeName", function(status) {
        if(s) return s;
        return !status;
      });
    }
  }
}

export type ProfileCardStateFnsType = ReturnType<typeof getStateFns>;

export const ProfileCardStateConfigs = {
  getInitialState,
  getStateFns
};