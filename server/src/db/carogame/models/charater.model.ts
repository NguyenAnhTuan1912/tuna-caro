import {
  ObjectId,
  Collection,
  Db,
  WithId,
  InsertOneResult,
  InsertManyResult,
  UpdateResult
} from "mongodb";
import Joi from "joi";

// Import from utils of mongo
import { MongoUtils } from "db/utils";

// Import from types
import {
  SchemaTimeType,
  MongoModelOptions,
  IMongoModel
} from "types";

export type CharacterType = {
  img: string;
  name: string;
};
export type CharacterQuery = {
  id?: string;
  name?: string;
  reg?: string;
};
export type CharactersQueryOptions = {
  limit?: number;
  skip?: number;
};
export type CharacterDocType = SchemaTimeType & CharacterType;

export interface ICharacter extends IMongoModel {
  // GET
  /**
   * Use this method to get a character that matches values in `q` object.
   * @param q 
   */
  getCharacter(q: CharacterQuery): Promise<WithId<CharacterDocType> | null>;
  /**
   * Use this method to get some characters that match values in `q` object.
   * @param q 
   */
  getCharacters(q: CharacterQuery, opt?: CharactersQueryOptions): Promise<WithId<CharacterDocType>[] | null>;

  // CREATE (Has overload)
  /**
   * Use this method to create a character, then add it to `characters` collection.
   * Has validation.
   * 
   * __Arguments__
   * - `data`: object contains about character information.
   * - `img`, `name`: maybe this method receives only img and name.
   * @param data 
   */
  createCharacter(data: CharacterType): Promise<InsertOneResult<CharacterDocType> | null>;
  createCharacter(img: string, name: string): Promise<InsertOneResult<CharacterDocType> | null>;
  /**
   * Use this method to create a character, then add it to `characters` collection.
   * Has validation.
   * 
   * __Arguments__
   * - `data`: an array of object of character information.
   * @param data 
   */
  createCharacters(data: Array<CharacterType>): Promise<InsertManyResult<CharacterDocType> | null>;

  // UPDATE
  updateCharacter(q: CharacterQuery, data: CharacterType): Promise<UpdateResult<CharacterDocType> | null>;
  updateCharacters(q: CharacterQuery, data: CharacterType): Promise<UpdateResult<CharacterDocType> | null>;

  // DELETE
  deleteCharacter(q: CharacterQuery): Promise<any>;
  deleteCharacters(q: CharacterQuery): Promise<any>;
}

export class CharacterModel implements ICharacter {
  static Schema = Joi.object<CharacterDocType>({
    img: Joi.string().required(),
    name: Joi.string().required(),
    createdAt: Joi.date().timestamp("javascript").default(Date.now()),
    updatedAt: Joi.date().timestamp("javascript").default(Date.now())
  });
  static Name = "characters";

  private _instance: Collection<CharacterDocType>;

  constructor(options: MongoModelOptions) {
    this._instance = options.dbInstance.collection(CharacterModel.Name);
  }

  async validate(data: CharacterType): Promise<CharacterDocType> {
    return CharacterModel.Schema.validateAsync(data);
  }
  
  async getCharacter(q: CharacterQuery): Promise<WithId<CharacterDocType> | null> {
    try {
      let result = await this._instance.findOne(MongoUtils.getQuery(q));
      return result;
    } catch (error) {
      return null;
    }
  }

  async getCharacters(q: CharacterQuery, opt?: CharactersQueryOptions): Promise<WithId<CharacterDocType>[] | null> {
    try {
      if(!opt) {
        opt = { limit: 10, skip: 0 };
      }

      let cursor = this._instance.find(MongoUtils.getQuery(q), opt);
      return await cursor.toArray();
    } catch (error) {
      return null;
    }
  }

  createCharacter(data: CharacterType): Promise<InsertOneResult<CharacterDocType> | null>;
  createCharacter(img: string, name: string): Promise<InsertOneResult<CharacterDocType> | null>;
  async createCharacter(g: any, name?: string): Promise<InsertOneResult<CharacterDocType> | null> {
    try {
      let doc = g;
      // There are 2 cases.
      // If typeof `doc` (or `g`) is `object`, that mean this method is received a character information object.
      if(typeof doc === "object") {

      }

      // If typeof `doc` (or `g`) is `string`, that mean this method is received `img` and `name`.
      if(typeof doc === "string") {
        doc = {
          img: g,
          name: name
        };
      }

      // Validate data
      let validated = await this.validate(doc);
      let result = await this._instance.insertOne(validated);
      return result;
    } catch (error) {
      return null;
    }
  }

  async createCharacters(data: CharacterType[]): Promise<InsertManyResult<CharacterDocType> | null> {
    try {
      let validated = await Promise.all(data.map(char => CharacterModel.Schema.validateAsync(char)));
      let result = await this._instance.insertMany(validated);
      return result;
    } catch (error) {
      return null;
    }
  }

  async updateCharacter(q: CharacterQuery, data: CharacterType): Promise<any> {
    try {
      let result = await this._instance.updateOne(MongoUtils.getQuery(q), {
        $set: {
          ...data,
          updatedAt: Date.now()
        }
      });
      return result;
    } catch (error) {
      return null;
    }
  }

  async updateCharacters(q: CharacterQuery, data: CharacterType): Promise<UpdateResult<CharacterDocType> | null> {
    try {
      let result = await this._instance.updateMany(MongoUtils.getQuery(q), {
        $set: {
          ...data,
          updatedAt: Date.now()
        }
      });
      return result;
    } catch (error) {
      return null;
    }
  }

  async deleteCharacter(q: CharacterQuery): Promise<any> {
    try {
      let result = await this._instance.deleteOne(MongoUtils.getQuery(q));
      return result;
    } catch (error) {
      return null;
    }
  }

  async deleteCharacters(q: CharacterQuery): Promise<any> {
    try {
      let result = await this._instance.deleteMany(MongoUtils.getQuery(q));
      return result;
    } catch (error) {
      return null;
    }
  }
};