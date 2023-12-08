import { Request, Response } from "express";

export type ResponseMessageType = {
  isError: boolean,
  code?: number,
  data?: any
  message?: string
};

export type ErrorReportType = {
  from?: string;
  $$error: string;
};

/**
 * Use this function to create a response message objects.
 * @param isError Is error?
 * @param data Data of response message.
 * @param message Content of response message.
 * @returns 
 */
function getResponseMessage(isError = false, data: any, message: string) {
  return {
    isError,
    data,
    message
  }
}

/**
 * Use `res` (Express Response Object) to response to client.
 * @param res 
 * @param status 
 * @param responseMessage 
 * @returns 
 */
function responseJSON(res: Response, status: number, responseMessage: ResponseMessageType) {
  responseMessage.code = status;
  return res.status(status).json(responseMessage);
}

/**
 * Use this function to create an error report when has an error. For internal use.
 * @param error 
 * @param from 
 * @returns 
 */
function reportError(error: string, from?: string): ErrorReportType {
  return { $$error: error, from };
}

export const RM = {
  getResponseMessage,
  responseJSON,
  reportError
}