import dotenv from 'dotenv';

dotenv.config();

export const env = {
  REQUEST_ORIGIN: process.env.REQUEST_ORIGIN,
  REQUEST_ORIGIN_MOBILE: process.env.REQUEST_ORIGIN_MOBILE
};