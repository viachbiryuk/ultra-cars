import { Injectable } from '@nestjs/common';
import { getRepository, LessThanOrEqual, Repository } from 'typeorm';
import * as moment from 'moment';
import { Owner } from './owner.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OwnersService {

  constructor(
    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,
  ) {}

  public async deleteOwnersWhoBoughtTheirCarsBefore(months: number): Promise<number> {
    const monthsAgo = moment().subtract(months, 'months').toDate();
    const deleteResult = await this.ownersRepository.delete({
      purchaseDate: LessThanOrEqual(monthsAgo),
    });
    return deleteResult.affected; // affected rows
  }
}
