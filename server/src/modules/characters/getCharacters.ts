import { createHandler } from "templates/handler";

const GetCharacterHandler = createHandler(
  "/",
  function({ DBs, Utils }) {
    return async function(req, res) {
      let statusCode = 500;
      try {
        let { id } = req.query;
        let characters = await DBs.CaroGameDB.Character.getCharacters({ id: id as string });
        
        if(!characters) {
          statusCode = 404;
          throw new Error("Characters not found.");
        };

        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, characters, "Characters found.")
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