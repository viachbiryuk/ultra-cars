import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { CONF } from './conf';
import { resolve } from "path";

export const typeOrmOptions: TypeOrmModuleOptions = {
  type: CONF.DB_TYPE as 'postgres',
  host: CONF.DB_HOST,
  port: CONF.DB_PORT,
  username: CONF.DB_USER,
  password: CONF.DB_PWD,
  database: CONF.DB_NAME,
  entities: [resolve(__dirname) + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: true,
};

export const typeOrmOptionsSeed: TypeOrmModuleOptions = {
  type: CONF.DB_TYPE as 'postgres',
  host: 'localhost',
  port: 9002,
  username: CONF.DB_USER,
  password: CONF.DB_PWD,
  database: CONF.DB_NAME,
  entities: [resolve(__dirname, '../') + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,
};
