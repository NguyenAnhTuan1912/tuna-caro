import { Db, ObjectId } from "mongodb";
import { Request, Response, NextFunction } from "express";
import MyServer from "classes/MyServer";

// Import from constant
import { GoogleMimeTypesType } from "constant";

// Union types
export type HTTPMethods = "get" | "post" | "put" | "delete" | "patch";
export type UserRoles = "admin" | "user";

export interface ServerOptions {
  port: string
}

export interface ServerBuilderOptions {
  server: MyServer
}

export interface IMongoModel {
  validateAsync(data: any): Promise<any>;
  partiallyValidateAsync(data: any): Promise<any>;
}

export interface APIHandler {
  path: string,
  handler: (req: Request, res: Response, next?: NextFunction) => Promise<any>
}

export interface EncodeOptions {
  expireTime?: number | string
}

export type MongoModelOptions = {
  dbInstance: Db
}

export type SchemaTimeType = {
  createdAt?: number;
  updatedAt?: number;
}

export type GoogleDriveDataType = {
  kind: string,
  mimeType: GoogleMimeTypesType,
  id: string,
  name: string
};