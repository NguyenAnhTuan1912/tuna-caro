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
const mongodb_1 = require("mongodb");
// Import from models
const charater_model_1 = require("./models/charater.model");
// Import environment variables
const env_1 = require("../../env");
const connetionString = `mongodb+srv://tunanguyen:${env_1.env.DB_USER_PASSWORDS.CAROGAME}@tunanguyen.vwxxmjo.mongodb.net/?retryWrites=true&w=majority`;
/**
 * Use this class to create a `CaroGameDB` (name: `carogame`) instance to manage and manipulate data.
 */
class CaroGameDB {
  constructor() {
    this.Character = new charater_model_1.CharacterModel({ dbInstance: CaroGameDB.client.db(CaroGameDB.Name) });
  }
  /**
   * Use this static function to connect to MongoDB.
   * @returns
   */
  static connect() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (CaroGameDB.isConnected)
        return true;
        console.log(`Connecting to ${CaroGameDB.Name} DB...`);
        yield CaroGameDB.client.connect();
        console.log(`Connect to ${CaroGameDB.Name} DB successfully!!!`);
        return true;
      }
      catch (error) {
        console.error(error.message);
        return false;
      }
    });
  }
}
CaroGameDB.isConnected = false;
CaroGameDB.client = new mongodb_1.MongoClient(connetionString);
CaroGameDB.Name = "carogame";
exports.default = CaroGameDB;