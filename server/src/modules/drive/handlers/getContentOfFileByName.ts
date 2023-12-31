import { createHandler } from "templates/handler";

const GetContentOfFileByNameHandler = createHandler(
  "/folders/:folder/:fileName",
  function({ DBs, Utils, Services }) {
    return async function(req, res) {
      let statusCode = 500;
      try {
        let { fileName, folder } = req.params;

        let fileList = await Services.Google.Drive.listFolderContentByNameAsync({
          fileName: fileName as string,
          folderName: folder as string
        });

        if(typeof fileList === "object" && "$$error" in fileList) {
          statusCode = 400;
          throw new Error(fileList.$$error);
        };

        if(!fileList.files) {
          statusCode = 400;
          throw new Error("Nothing found.");
        }

        let file = fileList.files[0];
        let contentOfFile = await Services.Google.Drive.getFileByIdAsync(file.id!, "media");
        console.log("Type of File: ", typeof contentOfFile);
        if(typeof contentOfFile === "object" && "$$error" in contentOfFile) {
          statusCode = 400;
          throw new Error(contentOfFile.$$error);
        };

        return res.status(200).send(contentOfFile);
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

export default GetContentOfFileByNameHandler;