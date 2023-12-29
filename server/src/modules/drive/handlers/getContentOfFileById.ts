import { createHandler } from "templates/handler";

const GetContentOfFileByIdHandler = createHandler(
  "/files/:id",
  function({ DBs, Utils, Services }) {
    return async function(req, res) {
      let statusCode = 500;
      try {
        let { id } = req.params;

        let file = await Services.Google.Drive.getFileByIdAsync(id, "media");

        if("$$error" in file) {
          statusCode = 400;
          throw new Error(file.$$error);
        };

        return res.status(200).send(file);
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

export default GetContentOfFileByIdHandler;