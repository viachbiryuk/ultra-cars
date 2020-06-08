import { config } from 'dotenv';
config();

export const CONF = {
  API_PORT: process.env.API_PORT,

  DB_TYPE: process.env.DB_TYPE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_EXPOSE_PORT: process.env.DB_EXPOSE_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PWD: process.env.DB_PWD,
};
