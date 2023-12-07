import dotenv from 'dotenv';

dotenv.config();

// Define some domains that can have permission to request.
const AUTHORIZED_DOMAINS = process.env.AUTHORIZED_DOMAINS?.split(";");

export const env = {
  AUTHORIZED_DOMAINS,
  NODE_ENV: process.env.NODE_ENV,
  DB_USER_PASSWORDS: {
    CAROGAME: process.env.DB_CAROGAME_PASSWORD
  }
};