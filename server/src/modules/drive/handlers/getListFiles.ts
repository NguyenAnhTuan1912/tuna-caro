import { createHandler } from "templates/handler";

const GetListFilesHandler = createHandler(
  "/files",
  function({ DBs, Utils, Services }) {
    return async function(req, res) {
      let statusCode = 500;
      try {
        let { name, folder } = req.query;

        let result;

        if(folder) {
          let opt = {
            folderName: folder as string,
            fileName: name as string
          };
          result = await Services.Google.Drive.listFolderContentByNameAsync(opt);
        } else {
          result = await Services.Google.Drive.listFilesAsync({ fileName: name as string });
        };

        if("$$error" in result) {
          statusCode = 400;
          throw new Error(result.$$error);
        };

        return Utils.RM.responseJSON(
          res,
          200,
          Utils.RM.getResponseMessage(false, result.files, "Get list of files successfully.")
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

export default GetListFilesHandler;