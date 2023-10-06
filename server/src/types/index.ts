import { Request, Response, NextFunction } from "express";
import MyServer from "classes/MyServer";

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
  validate: (data: any) => Promise<any>
}

export interface APIHandler {
  path: string,
  handler: (req: Request, res: Response, next?: NextFunction) => Promise<any>
}

export interface EncodeOptions {
  expireTime?: number | string
}