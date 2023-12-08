import { createHandler } from "templates/handler";

const GetCharacterHandler = createHandler(
  "/:id",
  function({ DBs, Utils }) {
    return async function(req, res) {
      let statusCode = 500;
      try {
        let { id } = req.params;
        let character = await DBs.CaroGameDB.Character.getCharacter({ id: id as string });

        if(!character) {
          statusCode = 404;
          throw new Error("Character not found.");
        };

        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, character, "Character found.")
        );
      } catch (error: any) {
        return Utils.RM.responseJSON(
          res,
          Utils.HTTPCodes[statusCode].code,
          Utils.RM.getResponseMessage(true, undefined, Utils.HTTPCodes[statusCode].title + ": " + error.message)
        );
      }
    }
  }
);

export default GetCharacterHandler;