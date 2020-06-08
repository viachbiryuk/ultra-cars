import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, getConnection, getRepository, Repository } from 'typeorm';
import * as moment from 'moment';
import { Car } from './car.entity';
import { Owner } from '../owners/owner.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { ICar } from './car.interface';
import { UpdateCarDto } from './dto/update-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from '../manufacturers/manufacturer.entity';

@Injectable()
export class CarsService {

  constructor(
    @InjectRepository(Car)
    private readonly carsRepository: Repository<Car>,
  ) {}

  public async applyDiscountOnCarsRegisteredInPeriod(
    discountPercent = 20,
    periodEndMonths: number,
    periodStartMonths: number,
    ): Promise<number> {
    const discountFactor = (100 - discountPercent) / 100;
    const fromDate = moment().subtract(periodStartMonths, 'months').toDate();
    const toDate = moment().subtract(periodEndMonths, 'months').toDate();
    const updateResult = await this.carsRepository
      .createQueryBuilder()
      .update(Car)
      .set({ price: () => `price * ${discountFactor}` })
      .where('firstRegistrationDate BETWEEN :from AND :to', {
        from: fromDate,
        to: toDate,
      })
      .returning(['id'])
      .execute();
    return updateResult.raw.length; // rows affected
  }

  public async createCar(car: CreateCarDto): Promise<ICar> {
    const owners = car.owners.map(ownerId => {
      const owner = new Owner();
      owner.id = ownerId;
      return owner;
    });
    const newCar = Object.assign(car, { owners });
    let savedCar = null;
    try {
      savedCar = await this.carsRepository.save(newCar as DeepPartial<Car>);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
    return savedCar;
  }

  public async getCars(): Promise<Car[]> {
    const found = await this.carsRepository.find({ relations: ['owners']});
    return found || [];
  }

  public async getCar(carId: string): Promise<Car> {
    return this.carsRepository.findOne({ id: carId }, { relations: ['owners']});
  }

  public async getCarManufacturer(carId: string): Promise<Manufacturer> {
    const car = await this.carsRepository.findOne({ id: carId }, { relations: ['manufacturer']});
    return car.manufacturer;
  }

  public async updateCar(carId: string, payload: UpdateCarDto): Promise<ICar> {
    let owners = null;
    const car = await this.carsRepository.findOne({ id: carId });
    let updatedCar = { ...car };
    if (payload.owners && payload.owners.length) {
      owners = payload.owners.map(ownerId => {
        const owner = new Owner();
        owner.id = ownerId;
        return owner;
      })
    }
    updatedCar = Object.assign(updatedCar, payload, { owners });
    return this.carsRepository.save(updatedCar);
  }

  public async deleteCar(carId: string): Promise<boolean> {
    const car = await this.carsRepository.findOne({ id: carId });
    if (car === undefined) {
      throw new NotFoundException();
    }
    await this.carsRepository.remove(car);
    return true;
  }


}
