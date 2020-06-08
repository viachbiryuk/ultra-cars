import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IManufacturer } from './manufacturer.interface';

@Entity({
  name: 'manufacturers',
})
export class Manufacturer implements IManufacturer {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public phone: string;

  @Column()
  public siret: number;

  constructor(id?: string) {
    this.id = id;
  }
}
