import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { OwnersService } from '../owners/owners.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { Repository } from 'typeorm';
import { Owner } from '../owners/owner.entity';
import { random } from 'faker';
import { generateCarObjectFromPayload, generateCreateCarPayload, generateManufacturer } from '../../test/utils';

describe('Cars Controller', () => {
  let controller: CarsController;
  let carsService: CarsService;
  let ownersService: OwnersService;

  const mockedCreateCarPayload = generateCreateCarPayload();
  const mockedCar = generateCarObjectFromPayload(mockedCreateCarPayload);
  const mockedManufacturer = generateManufacturer();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        CarsService,
        OwnersService,
        {
          provide: getRepositoryToken(Car),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Owner),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CarsController>(CarsController);
    carsService = module.get<CarsService>(CarsService);
    ownersService = module.get<OwnersService>(OwnersService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('.createCar() should return created car', async () => {
    jest.spyOn(carsService, 'createCar').mockResolvedValueOnce(mockedCar);
    const result = await controller.createCar(mockedCreateCarPayload);
    expect(result).toEqual(mockedCar);
  });

  it('.getCars() should return array of cars', async () => {
    jest.spyOn(carsService, 'getCars').mockResolvedValueOnce([mockedCar]);
    const result = await controller.getCars();
    expect(result).toEqual([mockedCar]);
  });

  it('.getCar() should return car by its ID', async () => {
    jest.spyOn(carsService, 'getCar').mockResolvedValueOnce(mockedCar);
    const carId = random.uuid('v4');
    const result = await controller.getCar(carId);
    expect(result).toEqual(mockedCar);
  });

  it('.getCarManufacturer() should return manufacturer by carId', async () => {
    jest.spyOn(carsService, 'getCarManufacturer').mockResolvedValueOnce(mockedManufacturer);
    const id = random.uuid('v4');
    const result = await controller.getCarManufacturer(id);
    expect(result).toEqual(mockedManufacturer);
  });

  it('.updateCar() should return updated car', async () => {
    jest.spyOn(carsService, 'updateCar').mockResolvedValueOnce(mockedCar);
    const carId = random.uuid('v4');
    const result = await controller.updateCar(carId, mockedCreateCarPayload);
    expect(result).toEqual(mockedCar);
  });

  it('.deleteCar() should return true, if car is deleted', async () => {
    jest.spyOn(carsService, 'deleteCar').mockResolvedValueOnce(true);
    const carId = random.uuid('v4');
    const result = await controller.deleteCar(carId);
    expect(result).toBeTruthy();
  });

  it('.boostSales() calls two methods in two services', async () => {
    jest.spyOn(ownersService, 'deleteOwnersWhoBoughtTheirCarsBefore').mockResolvedValueOnce(100);
    jest.spyOn(carsService, 'applyDiscountOnCarsRegisteredInPeriod').mockResolvedValueOnce(200);
    const result = await controller.boostSales();
    expect(result.carsUpdated).toEqual(200);
    expect(result.ownersDeleted).toEqual(100);
  });

});
