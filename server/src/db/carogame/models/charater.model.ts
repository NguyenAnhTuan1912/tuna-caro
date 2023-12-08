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

// Import from utils
import Utils from "utils";

// Import from utils of mongo
import { MongoUtils } from "db/utils";

// Import types
import {
  SchemaTimeType,
  MongoModelOptions,
  IMongoModel
} from "types";

import { ErrorReportType } from "utils/response_message";

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
  createCharacter(data: CharacterType): Promise<InsertOneResult<CharacterDocType> | ErrorReportType>;
  createCharacter(img: string, name: string): Promise<InsertOneResult<CharacterDocType> | ErrorReportType>;
  /**
   * Use this method to create a character, then add it to `characters` collection.
   * Has validation.
   * 
   * __Arguments__
   * - `data`: an array of object of character information.
   * @param data 
   */
  createCharacters(data: Array<CharacterType>): Promise<InsertManyResult<CharacterDocType> | ErrorReportType>;

  // UPDATE
  /**
   * Use this method to update a character, then use `q` to find and modify multiple character with `data`.
   * @param q 
   * @param data 
   */
  updateCharacter(q: CharacterQuery, data: CharacterType): Promise<UpdateResult<CharacterDocType> | null>;
  /**
   * Use this method to update a character, then use `q` to find and modify multiple characters with `data`.
   * @param q 
   * @param data 
   */
  updateCharacters(q: CharacterQuery, data: CharacterType): Promise<UpdateResult<CharacterDocType> | null>;

  // DELETE
  /**
   * Use this method to delete a character with `q` object.
   * @param q 
   */
  deleteCharacter(q: CharacterQuery): Promise<any>;
  /**
   * Use this method to delete characters with `q` object.
   * @param q 
   */
  deleteCharacters(q: CharacterQuery): Promise<any>;
}

export class CharacterModel implements ICharacter {
  static Schema = Joi.object<CharacterDocType>({
    img: Joi.string().required(),
    name: Joi.string().required(),
    createdAt: Joi.date().timestamp("javascript").default(Date.now()),
    updatedAt: Joi.date().timestamp("javascript").default(Date.now())
  });
  static PartialSchema = Joi.object<CharacterDocType>({
    img: Joi.string(),
    name: Joi.string()
  });
  static Name = "characters";

  private _instance: Collection<CharacterDocType>;

  constructor(options: MongoModelOptions) {
    this._instance = options.dbInstance.collection(CharacterModel.Name);
  }

  async validateAsync(data: CharacterType): Promise<CharacterDocType> {
    return CharacterModel.Schema.validateAsync(data);
  }

  async partiallyValidateAsync(data: Partial<CharacterType>): Promise<Partial<CharacterType>> {
    return CharacterModel.PartialSchema.validateAsync(data);
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
      };

      // If `limit` or `skip` is NaN or both, then set default value.
      opt.limit = opt.limit ? opt.limit : 10;
      opt.skip = opt.skip ? opt.skip : 0;
      
      let query = MongoUtils.getQuery(q, function(key, value) {
        if(key === "reg" && value) return { [key]: { $regex: value } };
      });

      let cursor = this._instance.find(query, opt);
      return await cursor.toArray();
    } catch (error) {
      return null;
    }
  }

  createCharacter(data: CharacterType): Promise<InsertOneResult<CharacterDocType> | ErrorReportType>;
  createCharacter(img: string, name: string): Promise<InsertOneResult<CharacterDocType> | ErrorReportType>;
  async createCharacter(g: any, name?: string): Promise<InsertOneResult<CharacterDocType> | ErrorReportType> {
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
      let validated = await this.validateAsync(doc);
      let result = await this._instance.insertOne(validated);
      return result;
    } catch (error: any) {
      return Utils.RM.reportError(error.message, "createCharacter() method");
    }
  }

  async createCharacters(data: CharacterType[]): Promise<InsertManyResult<CharacterDocType> | ErrorReportType> {
    try {
      let validated = await Promise.all(data.map(char => CharacterModel.Schema.validateAsync(char)));
      let result = await this._instance.insertMany(validated);
      return result;
    } catch (error: any) {
      return Utils.RM.reportError(error.message, "createCharacters() method");
    }
  }

  async updateCharacter(q: CharacterQuery, data: CharacterType): Promise<any> {
    try {
      let validated = await this.partiallyValidateAsync(data);
      let result = await this._instance.updateOne(MongoUtils.getQuery(q), {
        $set: {
          ...validated,
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