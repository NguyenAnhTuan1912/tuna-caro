import dotenv from 'dotenv';

const envPaths = [".env", ".env.wsms"];

// Configure environment variables depend of paths.
envPaths.forEach(path => {
  dotenv.config({ path })
});

// Define some domains that can have permission to request.
const AUTHORIZED_DOMAINS = process.env.AUTHORIZED_DOMAINS?.split(";");

export const env = {
  AUTHORIZED_DOMAINS,
  NODE_ENV: process.env.NODE_ENV,
  DB_USER_PASSWORDS: {
    CAROGAME: process.env.DB_CAROGAME_PASSWORD
  },
  WS_MESSAGE_KEYS: {
    NOT_EXIST_ROOM: process.env.NOT_EXIST_ROOM,
    FULL_ROOM: process.env.FULL_ROOM,
    WRONG_PASSWORD: process.env.WRONG_PASSWORD,
    CREATE_GAME_SUCCESSFULLY: process.env.CREATE_GAME_SUCCESSFULLY,
    DISCONNECTED: process.env.DISCONNECTED,
    RECONNECTED: process.env.RECONNECTED,
    LEAVE_GAME: process.env.LEAVE_GAME,
    RECONNECTED_GAME_SUCCESSFULLY: process.env.RECONNECTED_GAME_SUCCESSFULLY,
    HANDSHAKE: process.env.HANDSHAKE,
    JOIN_GAME: process.env.JOIN_GAME
  },
  GAPI_CLIENT_ID: process.env.GAPI_CLIENT_ID,
  GAPI_CLIENT_SECRET: process.env.GAPI_CLIENT_SECRET,
  GAPI_REDIRECT_URI: process.env.GAPI_REDIRECT_URI,
  GAPI_REFRESH_TOKEN: process.env.GAPI_REFRESH_TOKEN
};