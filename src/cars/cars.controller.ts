import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ICar } from './car.interface';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { IManufacturer } from '../manufacturers/manufacturer.interface';
import { CarsService } from './cars.service';
import { OwnersService } from '../owners/owners.service';

@Controller('cars')
export class CarsController {

  constructor(
    private readonly carsService: CarsService,
    private readonly ownersService: OwnersService,
  ) {}

  @Get('boost-sales')
  public async boostSales(): Promise<any> {
    const ownersDeleted = await this.ownersService
      .deleteOwnersWhoBoughtTheirCarsBefore(18);
    const carsUpdated = await this.carsService
      .applyDiscountOnCarsRegisteredInPeriod(20, 12, 18);
    return {
      ownersDeleted,
      carsUpdated,
    };
  }

  @Post()
  public async createCar(
    @Body() car: CreateCarDto,
  ): Promise<ICar> {
    return this.carsService.createCar(car);
  }

  @Get()
  public async getCars(): Promise<ICar[]> {
    return this.carsService.getCars();
  }

  @Get(':id')
  public async getCar(
    @Param('id') carId: string,
  ): Promise<ICar> {
    return this.carsService.getCar(carId);
  }

  @Get(':id/manufacturer')
  public async getCarManufacturer(
    @Param('id') carId: string,
  ): Promise<IManufacturer> {
    return this.carsService.getCarManufacturer(carId);
  }

  @Patch(':id')
  public async updateCar(
    @Param('id') carId: string,
    @Body() body: UpdateCarDto,
  ): Promise<ICar> {
    return this.carsService.updateCar(carId, body);
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteCar(
    @Param('id') carId: string,
  ): Promise<boolean> {
    return this.carsService.deleteCar(carId);
  }

}
