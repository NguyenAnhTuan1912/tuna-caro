"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleService = void 0;
const googleapis_1 = require("googleapis");
const drive_1 = require("./drive");
const env_1 = require("../../env");
let drive = undefined;
const CLIENT_ID = env_1.env.GAPI_CLIENT_ID;
const CLIENT_SECRET = env_1.env.GAPI_CLIENT_SECRET;
const REDIRECT_URI = env_1.env.GAPI_REDIRECT_URI;
const REFRESH_TOKEN = env_1.env.GAPI_REFRESH_TOKEN;
const oauth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
});
exports.GoogleService = {
  Drive: (0, drive_1.getDriveAPICallers)(oauth2Client, drive)
};