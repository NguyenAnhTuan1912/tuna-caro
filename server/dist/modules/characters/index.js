"use strict";
/**
 * Because of the simple of document of character, so I do not build delete and update for
 * multiple characters.
 */
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../../templates/router");
const bases = {
  characters: "/characters",
  character: "/character"
};
// Import handlers
const getCharacter_1 = __importDefault(require("./handlers/getCharacter"));
const getCharacters_1 = __importDefault(require("./handlers/getCharacters"));
const createCharacter_1 = __importDefault(require("./handlers/createCharacter"));
const updateCharacter_1 = __importDefault(require("./handlers/updateCharacter"));
const deleteCharacter_1 = __importDefault(require("./handlers/deleteCharacter"));
const CharacterRouter = (0, router_1.createRouter)({
  handlers: [
  // GET
  {
    path: bases.characters + getCharacter_1.default.path,
    method: "get",
    fns: [getCharacter_1.default.handler]
  },
  {
    path: bases.characters + getCharacters_1.default.path,
    method: "get",
    fns: [getCharacters_1.default.handler]
  },
  // CREATE (POST)
  {
    path: bases.character + createCharacter_1.default.path,
    method: "post",
    fns: [createCharacter_1.default.handler]
  },
  // UPDATE (PUT)
  {
    path: bases.character + updateCharacter_1.default.path,
    method: "put",
    fns: [updateCharacter_1.default.handler]
  },
  // DELETE
  {
    path: bases.character + deleteCharacter_1.default.path,
    method: "delete",
    fns: [deleteCharacter_1.default.handler]
  }]

});
exports.default = CharacterRouter;