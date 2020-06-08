import { createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { generateManufacturer, generateOwner } from './utils';
import { Manufacturer } from '../src/manufacturers/manufacturer.entity';
import { Owner } from '../src/owners/owner.entity';
import { typeOrmOptionsSeed } from '../src/app.constants';

(async () => {
  const conn = await createConnection(typeOrmOptionsSeed as PostgresConnectionOptions);

  const ownerA = generateOwner(19);
  const manufacturerA = generateManufacturer();

  await conn.getRepository(Manufacturer).save(manufacturerA);
  await conn.getRepository(Owner).save(ownerA);

  console.log('seeding finished!');
  process.exit(0);
})();
