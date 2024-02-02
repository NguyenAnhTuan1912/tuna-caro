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
const GetCharactersHandler = (0, handler_1.createHandler)("/", function ({ DBs, Utils }) {
  return function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      let statusCode = 500;
      try {
        let { name, reg, limit, skip } = req.query;
        let characters = yield DBs.CaroGameDB.Character.getCharacters({ name, reg }, { limit: parseInt(limit), skip: parseInt(skip) });
        if (!characters) {
          statusCode = 404;
          throw new Error("Characters not found.");
        }
        ;
        return Utils.RM.responseJSON(res, 200, Utils.RM.getResponseMessage(false, characters, "Characters found."));
      }
      catch (error) {
        return Utils.RM.responseJSON(res, Utils.HTTPCodes[statusCode].code, Utils.RM.getResponseMessage(true, undefined, Utils.HTTPCodes[statusCode].title + ": " + error.message));
      }
    });
  };
});
exports.default = GetCharactersHandler;