import { CONF } from './conf';
import { resolve } from "path";

export = {
  type: CONF.DB_TYPE as 'postgres',
  host: 'localhost',
  port: 9002,
  username: CONF.DB_USER,
  password: CONF.DB_PWD,
  database: CONF.DB_NAME,
  entities: [resolve(__dirname) + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
  migrationsTableName: 'migrations',
  migrations: ['migrations/*.ts'],
  cli: {
    migrationsDir: 'migrations',
  }
};
