import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Manufacturer } from '../manufacturers/manufacturer.entity';
import { ICar } from './car.interface';
import { Owner } from '../owners/owner.entity';

@Entity({
  name: 'cars'
})
export class Car implements ICar {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(belongsTo => Manufacturer)
  @JoinColumn()
  public manufacturer: Manufacturer;

  @Column()
  public price: number;

  @Column()
  public firstRegistrationDate: Date;

  @ManyToMany(type => Owner, owner => owner.cars)
  @JoinTable({
    name: 'car_owners',
    joinColumn: {
      name: 'car_id',
    },
    inverseJoinColumn: {
      name: 'owner_id',
    }
  })
  public owners: string[] | Owner[];
}

