import { MongoClient } from "mongodb";

// Import from models
import { CharacterModel } from "./models/charater.model";

// Import environment variables
import { env } from "env";

const connetionString = `mongodb+srv://tunanguyen:${env.DB_USER_PASSWORDS.CAROGAME}@tunanguyen.vwxxmjo.mongodb.net/?retryWrites=true&w=majority`;

/**
 * Use this class to create a `CaroGameDB` (name: `carogame`) instance to manage and manipulate data.
 */
export default class CaroGameDB {
  static isConnected = false;
  static client = new MongoClient(connetionString);
  static Name = "carogame";

  Character: CharacterModel;

  constructor() {
    this.Character = new CharacterModel({ dbInstance: CaroGameDB.client.db(CaroGameDB.Name) });
  }

  /**
   * Use this static function to connect to MongoDB.
   * @returns 
   */
  static async connect() {
    try {
      if(CaroGameDB.isConnected) return true;
      console.log("Connecting to CaroGame DB...");
      await CaroGameDB.client.connect();
      console.log("Connect to CaroGame DB successfully!!!");
      return true; 
    } catch (error: any) {
      console.error(error.message);
      return false;
    }
  }
}