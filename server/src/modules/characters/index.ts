/**
 * Because of the simple of document of character, so I do not build delete and update for
 * multiple characters.
 */

import { createRouter } from "templates/router";

const bases = {
  characters: "/characters",
  character: "/character"
};

// Import handlers
import GetCharacterHandler from "./handlers/getCharacter";
import GetCharactersHandler from "./handlers/getCharacters";
import CreateCharacterHandler from "./handlers/createCharacter";
import UpdateCharacterHandler from "./handlers/updateCharacter";
import DeleteCharacterHandler from "./handlers/deleteCharacter";

const CharacterRouter = createRouter({
  handlers: [
    // GET
    {
      path: bases.characters + GetCharacterHandler.path,
      method: "get",
      fns: [GetCharacterHandler.handler]
    },
    {
      path: bases.characters + GetCharactersHandler.path,
      method: "get",
      fns: [GetCharactersHandler.handler]
    },
    // CREATE (POST)
    {
      path: bases.character + CreateCharacterHandler.path,
      method: "post",
      fns: [CreateCharacterHandler.handler]
    },
    // UPDATE (PUT)
    {
      path: bases.character + UpdateCharacterHandler.path,
      method: "put",
      fns: [UpdateCharacterHandler.handler]
    },
    // DELETE
    {
      path: bases.character + DeleteCharacterHandler.path,
      method: "delete",
      fns: [DeleteCharacterHandler.handler]
    }
  ]
});

export default CharacterRouter;