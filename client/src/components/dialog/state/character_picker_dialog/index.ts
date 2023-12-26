// Import from hooks
import { ChangeStateFnType } from "src/hooks/useStateWESSFns";

// Import from types
import { CharacterType } from "src/types/character.types";

/**
 * Use this function to get the initial state of `CharacterPickerDialog`.
 * @returns 
 */
function getInitialState() {
  return {
    skip: "0",
    characters: [] as Array<CharacterType>,
    choice: {
      _id: "",
      name: "",
      img: ""
    },
  }
};

/**
 * Use this function to get all `set state` functions of `CharacterPickerDialog`.
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
     * Use this function to add new list of character to main data.
     * @param characters 
     */
    addCharacters: function(characters: Array<CharacterType>) {
      let N = characters.length;

      if(N > 0) {
        changeState("characters", function(data) {
          data = data.concat(characters);
          return [...data];
        });

        changeState("skip", function(data) {
          return (data + N).toString();
        });
      }
    },

    /**
     * Use this function to clear data of character.
     */
    clearCharacter: function() {
      changeState("characters", function() {
        return [];
      });
    },

    /**
     * Use this function to set the character who is chose.
     * @param character 
     */
    setChoice: function(character: CharacterType) {
      changeState("choice", function() {
        return { img: character.img, name: character.name, _id: character._id }
      })
    }
  }
}

export type CharacterPickerDialogStateFnsType = ReturnType<typeof getStateFns>;

export const CharacterPickerDialogStateConfigs = {
  getInitialState,
  getStateFns
};