import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import { Car } from './car.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateCarObjectFromPayload, generateCreateCarPayload } from '../../test/utils';
import { random, name, phone } from 'faker';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('CarsService', () => {
  let service: CarsService;
  let carsRepository: Repository<Car>;

  const mockedCreateCarPayload = generateCreateCarPayload();
  const mockedCar = generateCarObjectFromPayload(mockedCreateCarPayload);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: getRepositoryToken(Car),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
    carsRepository = module.get<Repository<Car>>(getRepositoryToken(Car));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('.applyDiscountOnCarsRegisteredInPeriod() should update N cars', async () => {
    const updatedCarsIds = [random.uuid('v4')];
    const updateResult = { raw: updatedCarsIds };
    const qb2 = function() {
      this.select = jest.fn().mockReturnThis();
      this.update = jest.fn().mockReturnThis();
      this.set = () => this;
      this.where = jest.fn().mockReturnThis();
      this.returning = jest.fn().mockReturnThis();
      this.execute = jest.fn().mockResolvedValue(updateResult);
    }

    jest.spyOn(carsRepository, 'createQueryBuilder').mockReturnValue(new qb2());
    const result = await service.applyDiscountOnCarsRegisteredInPeriod(20, 12, 18);
    expect(result).toEqual(1);
  });

  it('.createCar() should return created car', async () => {
    jest.spyOn(carsRepository, 'save').mockResolvedValueOnce(mockedCar);
    const result = await service.createCar(mockedCreateCarPayload);
    expect(result).toEqual(mockedCar);
  });

  it('.createCar() should throw 400th Error, if could not create a car', async () => {
    jest.spyOn(carsRepository, 'save').mockImplementation(() => {
      throw new BadRequestException();
    });
    try {
      await service.createCar(mockedCreateCarPayload);
      expect(false).toBeTruthy(); // fail the test if not error thrown
    } catch (e) {
      expect(e).toBeInstanceOf(BadRequestException);
    }
  });

  it('.getCars() should return list of cars', async () => {
    jest.spyOn(carsRepository, 'find').mockResolvedValueOnce([mockedCar]);
    const result = await service.getCars();
    expect(result).toEqual([mockedCar]);
  });

  it('.getCar() should return car by ID', async () => {
    const carId = random.uuid('v4');
    jest.spyOn(carsRepository, 'findOne').mockResolvedValueOnce(mockedCar);
    const result = await service.getCar(carId);
    expect(result).toEqual(mockedCar);
  });

  it('.getCarManufacturer() should return manufacturer by carId', async () => {
    const carId = random.uuid('v4');
    jest.spyOn(carsRepository, 'findOne').mockResolvedValueOnce(mockedCar);
    const result = await service.getCarManufacturer(carId);
    expect(result).toEqual(mockedCar.manufacturer);
  });

  it('.updateCar() should update car with payload', async () => {
    const carId = random.uuid('v4');
    jest.spyOn(carsRepository, 'findOne').mockResolvedValueOnce(mockedCar);
    jest.spyOn(carsRepository, 'save').mockResolvedValueOnce(mockedCar);
    const result = await service.updateCar(carId, mockedCreateCarPayload);
    expect(result).toEqual(mockedCar);
  });

  it('.deleteCar() should return true, if car is found by ID and deleted', async () => {
    jest.spyOn(carsRepository, 'findOne').mockResolvedValueOnce(mockedCar);
    jest.spyOn(carsRepository, 'remove').mockResolvedValueOnce(mockedCar);
    const result = await service.deleteCar(mockedCar.id);
    expect(result).toEqual(true);
  });

  it('.deleteCar() should return throw an Error, if car is NOT found by ID and deleted', async () => {
    jest.spyOn(carsRepository, 'findOne').mockReturnValue(undefined);
    try {
      await service.deleteCar(mockedCar.id);
      expect(false).toBeTruthy(); // fail the test if not error thrown
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
    }
  });
});

