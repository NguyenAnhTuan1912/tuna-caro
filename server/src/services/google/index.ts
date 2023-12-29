import { google, drive_v3 } from "googleapis";

import { getDriveAPICallers } from "./drive";

import { env } from "env";

let drive: drive_v3.Drive | undefined = undefined;

const CLIENT_ID = env.GAPI_CLIENT_ID;
const CLIENT_SECRET = env.GAPI_CLIENT_SECRET;
const REDIRECT_URI = env.GAPI_REDIRECT_URI;
const REFRESH_TOKEN = env.GAPI_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
});

export type GoogleServiceType = typeof GoogleService;

export const GoogleService = {
  Drive: getDriveAPICallers(oauth2Client, drive)
};