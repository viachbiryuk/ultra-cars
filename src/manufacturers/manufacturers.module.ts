import { Module } from '@nestjs/common';
import { Manufacturer } from './manufacturer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Manufacturer,
    ]),
  ],
})
export class ManufacturersModule {}
