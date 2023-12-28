import { createHandler } from "templates/handler";

const GetListFoldersHandler = createHandler(
  "/folders",
  function({ DBs, Utils, Services }) {
    return async function(req, res) {
      let statusCode = 500;
      try {
        let result = await Services.Google.Drive.listFoldersInfoAysnc();

        if("$$error" in result) {
          statusCode = 400;
          throw new Error(result.$$error);
        };

        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, result.files, "Get list of folders successfully.")
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

export default GetListFoldersHandler;