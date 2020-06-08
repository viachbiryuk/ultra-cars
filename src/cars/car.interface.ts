import { IManufacturer } from '../manufacturers/manufacturer.interface';
import { IOwner } from '../owners/owner.interface';

export interface ICar {
  id?: string;
  manufacturer: IManufacturer;
  price: number;
  firstRegistrationDate: Date;
  owners: string[] | IOwner[];
}
