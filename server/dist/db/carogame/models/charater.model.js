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
var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterModel = void 0;
const joi_1 = __importDefault(require("joi"));
// Import from utils
const utils_1 = __importDefault(require("../../../utils"));
// Import from utils of mongo
const utils_2 = require("../../utils");
class CharacterModel {
  constructor(options) {
    this._instance = options.dbInstance.collection(CharacterModel.Name);
  }
  validateAsync(data) {
    return __awaiter(this, void 0, void 0, function* () {
      return CharacterModel.Schema.validateAsync(data);
    });
  }
  partiallyValidateAsync(data) {
    return __awaiter(this, void 0, void 0, function* () {
      return CharacterModel.PartialSchema.validateAsync(data);
    });
  }
  getCharacter(q) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let result = yield this._instance.findOne(utils_2.MongoUtils.getQuery(q));
        return result;
      }
      catch (error) {
        return null;
      }
    });
  }
  getCharacters(q, opt) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (!opt) {
          opt = { limit: 10, skip: 0 };
        }
        ;
        // If `limit` or `skip` is NaN or both, then set default value.
        opt.limit = opt.limit ? opt.limit : 10;
        opt.skip = opt.skip ? opt.skip : 0;
        let query = utils_2.MongoUtils.getQuery(q, function (key, value) {
          if (key === "reg" && value)
          return { [key]: { $regex: value } };
        });
        let cursor = this._instance.find(query, opt);
        return yield cursor.toArray();
      }
      catch (error) {
        return null;
      }
    });
  }
  createCharacter(g, name) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let doc = g;
        // There are 2 cases.
        // If typeof `doc` (or `g`) is `object`, that mean this method is received a character information object.
        if (typeof doc === "object") {
        }
        // If typeof `doc` (or `g`) is `string`, that mean this method is received `img` and `name`.
        if (typeof doc === "string") {
          doc = {
            img: g,
            name: name
          };
        }
        // Validate data
        let validated = yield this.validateAsync(doc);
        let result = yield this._instance.insertOne(validated);
        return result;
      }
      catch (error) {
        return utils_1.default.RM.reportError(error.message, "createCharacter() method");
      }
    });
  }
  createCharacters(data) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let validated = yield Promise.all(data.map((char) => CharacterModel.Schema.validateAsync(char)));
        let result = yield this._instance.insertMany(validated);
        return result;
      }
      catch (error) {
        return utils_1.default.RM.reportError(error.message, "createCharacters() method");
      }
    });
  }
  updateCharacter(q, data) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let validated = yield this.partiallyValidateAsync(data);
        let result = yield this._instance.updateOne(utils_2.MongoUtils.getQuery(q), {
          $set: Object.assign(Object.assign({}, validated), { updatedAt: Date.now() })
        });
        return result;
      }
      catch (error) {
        return null;
      }
    });
  }
  updateCharacters(q, data) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let result = yield this._instance.updateMany(utils_2.MongoUtils.getQuery(q), {
          $set: Object.assign(Object.assign({}, data), { updatedAt: Date.now() })
        });
        return result;
      }
      catch (error) {
        return null;
      }
    });
  }
  deleteCharacter(q) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let result = yield this._instance.deleteOne(utils_2.MongoUtils.getQuery(q));
        return result;
      }
      catch (error) {
        return null;
      }
    });
  }
  deleteCharacters(q) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let result = yield this._instance.deleteMany(utils_2.MongoUtils.getQuery(q));
        return result;
      }
      catch (error) {
        return null;
      }
    });
  }
}
exports.CharacterModel = CharacterModel;
CharacterModel.Schema = joi_1.default.object({
  img: joi_1.default.string().required(),
  name: joi_1.default.string().required(),
  createdAt: joi_1.default.date().timestamp("javascript").default(Date.now()),
  updatedAt: joi_1.default.date().timestamp("javascript").default(Date.now())
});
CharacterModel.PartialSchema = joi_1.default.object({
  img: joi_1.default.string(),
  name: joi_1.default.string()
});
CharacterModel.Name = "characters";
;