import {
  IsNumber,
  IsUUID,
  IsDateString,
} from 'class-validator';

export class UpdateCarDto {
  @IsNumber()
  public price: number;

  @IsUUID()
  public manufacturer: string;

  @IsDateString()
  public firstRegistrationDate: Date;

  @IsUUID('all', { each: true })
  public owners: string[];
}
