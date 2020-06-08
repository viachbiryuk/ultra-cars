import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ManufacturersModule } from '../src/manufacturers/manufacturers.module';
import { OwnersModule } from '../src/owners/owners.module';
import { CarsModule } from '../src/cars/cars.module';
import { Car } from '../src/cars/car.entity';
import { Owner } from '../src/owners/owner.entity';
import { Manufacturer } from '../src/manufacturers/manufacturer.entity';
import { DeepPartial, getConnectionManager } from 'typeorm';
import {
  generateCar,
  generateCreateCarPayload,
  generateManufacturer,
  generateOwner, toObject,
} from './utils';

const testDbName = 'ultra_db_test';

export const typeOrmOptionsTest: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 9002,
  username: 'ultra_admin',
  password: 'ultra_pwd',
  database: testDbName,
  entities: [Car, Owner, Manufacturer],
  synchronize: true,
  logging: false,
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let ownerA: Owner;
  let manufacturerA: Manufacturer;
  let carA: Car;
  let carB: Car;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [
        ManufacturersModule,
        OwnersModule,
        CarsModule,
        TypeOrmModule.forRoot(typeOrmOptionsTest),
      ],
    }).compile();

    app = testingModule.createNestApplication();

    const connection = await getConnectionManager().get('default');

    await connection.getRepository(Car).delete({});
    await connection.getRepository(Manufacturer).delete({});
    await connection.getRepository(Owner).delete({});

    try {
      await connection.query(`CREATE DATABASE ${testDbName} OWNER ultra_admin`);
    } catch {
      /* do nothing. db exists */
    }

    ownerA = generateOwner(19);
    manufacturerA = generateManufacturer();
    carA = generateCar(manufacturerA, [ownerA]);
    carB = generateCar(manufacturerA, [ownerA], 14);

    await connection.getRepository(Manufacturer).save(manufacturerA);
    await connection.getRepository(Owner).save(ownerA);
    await connection.getRepository(Car).save([carA, carB] as DeepPartial<Car>[]);

    await app.init();

  });

  afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
  });

  afterEach(async (done) => {
    await app.close();
    done();
  });

  it('/cars (GET)', async () => {
    const expectedCar = toObject(carA);
    delete expectedCar.manufacturer;
    const result = await request(app.getHttpServer())
      .get('/cars')
      .expect(200)
    const receivedIds = result.body.map(car => car.id);
    const expectedIds = [carA.id, carB.id];
    expect(receivedIds).toEqual(expect.arrayContaining(expectedIds));
  });

  it('/cars/:id (GET)', async () => {
    const result = await request(app.getHttpServer())
      .get('/cars/' + carA.id)
      .expect(200)
    expect(result.body.id).toEqual(carA.id);
  });

  it('/cars/:id/manufacturer (GET)', async () => {
    const result = await request(app.getHttpServer())
      .get('/cars/' + carA.id + '/manufacturer')
      .expect(200)
    expect(result.body.id).toEqual(manufacturerA.id);
  });

  it('/cars (POST)', async () => {
    const payload = generateCreateCarPayload(null, manufacturerA.id, [ownerA.id]);
    const result = await request(app.getHttpServer())
      .post('/cars')
      .send(payload)
      .expect(201)
    expect(result.body.price).toBe(payload.price);
    expect(result.body.manufacturer).toBe(payload.manufacturer);
    expect(result.body.owners[0].id).toBe(payload.owners[0]);
  });

  it('/cars/:id (PATCH)', async () => {
    const newPrice = 999;
    const result = await request(app.getHttpServer())
      .patch('/cars/' + carA.id)
      .send({
        price: newPrice,
      })
      .expect(200)
    expect(result.body.price).toEqual(newPrice);
  });

  it('/cars/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete('/cars/' + carA.id)
      .expect(204)
    const result = await request(app.getHttpServer())
      .get('/cars')
    expect(result.body.length).toEqual(1);
  });

  it('/cars/boost-sales (GET)', async () => {
    await request(app.getHttpServer())
      .get('/cars/boost-sales')
      .expect(200)
      .expect({
        ownersDeleted: 1,
        carsUpdated: 1,
      });
  });

});
