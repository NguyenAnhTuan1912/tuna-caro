"use strict";
var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {return value instanceof P ? value : new P(function (resolve) {resolve(value);});}
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {try {step(generator.next(value));} catch (e) {reject(e);}}
    function rejected(value) {try {step(generator["throw"](value));} catch (e) {reject(e);}}
    function step(result) {result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);}
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("../../../templates/handler");
const GetContentOfFileByNameHandler = (0, handler_1.createHandler)("/folders/:folder/:fileName", function ({ DBs, Utils, Services }) {
  return function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      let statusCode = 500;
      try {
        let { fileName, folder } = req.params;
        let fileList = yield Services.Google.Drive.listFolderContentByNameAsync({
          fileName: fileName,
          folderName: folder
        });
        if (typeof fileList === "object" && "$$error" in fileList) {
          statusCode = 400;
          throw new Error(fileList.$$error);
        }
        ;
        if (!fileList.files) {
          statusCode = 400;
          throw new Error("Nothing found.");
        }
        let file = fileList.files[0];
        let contentOfFile = yield Services.Google.Drive.getFileByIdAsync(file.id, "media");
        if (typeof contentOfFile === "object" && "$$error" in contentOfFile) {
          statusCode = 400;
          throw new Error(contentOfFile.$$error);
        }
        ;
        return res.status(200).send(contentOfFile);
      }
      catch (error) {
        return Utils.RM.responseJSON(res, Utils.HTTPCodes[statusCode].code, Utils.RM.getResponseMessage(true, undefined, Utils.HTTPCodes[statusCode].title + ": " + error.message));
      }
    });
  };
});
exports.default = GetContentOfFileByNameHandler;