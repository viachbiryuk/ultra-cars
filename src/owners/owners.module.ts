import { Module } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Owner } from './owner.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Owner,
    ]),
  ],
  providers: [
    OwnersService,
  ],
  exports: [OwnersService],
})
export class OwnersModule {}
