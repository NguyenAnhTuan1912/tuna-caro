import { createRouter } from "templates/router";

// Import handlers
import GetCharacterHandler from "./getCharacters";

const CharacterRouter = createRouter({
  handlers: [
    {
      path: "/characters",
      method: "get",
      fns: [GetCharacterHandler.handler]
    }
  ]
});

export default CharacterRouter;