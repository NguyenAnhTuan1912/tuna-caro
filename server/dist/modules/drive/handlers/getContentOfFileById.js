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
const GetContentOfFileByIdHandler = (0, handler_1.createHandler)("/files/:id", function ({ DBs, Utils, Services }) {
  return function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      let statusCode = 500;
      try {
        let { id } = req.params;
        let file = yield Services.Google.Drive.getFileByIdAsync(id, "media");
        if (typeof file === "object" && "$$error" in file) {
          statusCode = 400;
          throw new Error(file.$$error);
        }
        ;
        return res.status(200).send(file);
      }
      catch (error) {
        return Utils.RM.responseJSON(res, Utils.HTTPCodes[statusCode].code, Utils.RM.getResponseMessage(true, undefined, Utils.HTTPCodes[statusCode].title + ": " + error.message));
      }
    });
  };
});
exports.default = GetContentOfFileByIdHandler;