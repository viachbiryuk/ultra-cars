import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IOwner } from './owner.interface';
import { Car } from '../cars/car.entity';

@Entity({
  name: 'owners',
})
export class Owner implements IOwner {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Column()
  public purchaseDate: Date;

  @ManyToMany(type => Car, car => car.owners)
  public cars: Car[];

  constructor(id?: string) {
    this.id = id;
  }
}
