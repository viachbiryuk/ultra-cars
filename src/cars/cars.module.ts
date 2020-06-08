import { Module } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { OwnersModule } from '../owners/owners.module';

@Module({
  imports: [
    OwnersModule,
    TypeOrmModule.forFeature([
      Car,
    ]),
  ],
  providers: [CarsService],
  controllers: [CarsController]
})
export class CarsModule {}
