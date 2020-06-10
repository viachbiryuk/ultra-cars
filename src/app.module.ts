import { Module } from '@nestjs/common';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { OwnersModule } from './owners/owners.module';
import { CarsModule } from './cars/cars.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmOptions } from './typeorm-config';

@Module({
  imports: [
    ManufacturersModule,
    OwnersModule,
    CarsModule,
    TypeOrmModule.forRoot(typeOrmOptions),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
