import { Manufacturer } from '../src/manufacturers/manufacturer.entity';
import { Car } from '../src/cars/car.entity';
import { CreateCarDto } from '../src/cars/dto/create-car.dto';
import { Owner } from '../src/owners/owner.entity';
import { random, name, phone } from 'faker';
import * as moment from 'moment';

export function generateManufacturer(): Manufacturer {
  const manuf = new Manufacturer();
  manuf.id = random.uuid('v4');
  manuf.name = name.firstName() + ' ' + name.lastName();
  manuf.phone = phone.phoneNumber();
  manuf.siret = random.number();
  return manuf;
}

export function generateOwner(decreasePurchaseDateByMonths?: number): Owner {
  let decreasedDate = null;
  if (decreasePurchaseDateByMonths) {
    decreasedDate = moment().subtract(decreasePurchaseDateByMonths, 'months').toDate();
  }

  const owner = new Owner();
  owner.id = random.uuid('v4');
  owner.purchaseDate = decreasedDate || genDate();
  owner.name = name.firstName() + name.lastName();
  return owner;
}

export function generateCar(manufacturer?: Manufacturer, owners?: Owner[], decreaseFirstRegistrationDateByMonths?: number): Car {
  let decreasedDate = null;
  if (decreaseFirstRegistrationDateByMonths) {
    decreasedDate = moment().subtract(decreaseFirstRegistrationDateByMonths, 'months').toDate();
  }

  const car = new Car();
  car.id = random.uuid('v4');
  car.price = random.number();
  car.manufacturer = manufacturer ? manufacturer : generateManufacturer();
  car.owners = owners || [];
  car.firstRegistrationDate = decreasedDate || genDate();
  return car;
}

export function generateCreateCarPayload(id?: string, manufacturerId?: string, ownerIds?: string[]): CreateCarDto {
  const car: CreateCarDto = {
    manufacturer: manufacturerId || random.uuid('v4'),
    price: random.number(),
    firstRegistrationDate: genDate(),
    owners: ownerIds || [random.uuid('v4')]
  };
  if (id) {
    car.id = id;
  }
  return car;
}

export function generateCreateCarPostPayload(id?: string, manufacturerId?: string, ownerIds?: string[]): CreateCarDto {
  const car = generateCreateCarPayload(id, manufacturerId, ownerIds);
  const owners = car.owners.map(ownerId => new Owner(ownerId));
  return Object.assign(car, { owners });
}

export function generateCarObjectFromPayload(payload: CreateCarDto): Car {
  const car = new Car();
  car.id = random.uuid('v4');
  car.price = payload.price;
  car.manufacturer = new Manufacturer(payload.manufacturer);
  car.firstRegistrationDate = payload.firstRegistrationDate;
  car.owners = payload.owners.map(ownerId => new Owner(ownerId));
  return car;
}

export function toObject(classObj: any): any {
  return JSON.parse(JSON.stringify(classObj));
}

export function genDate(date?: Date): Date {
  const d = new Date(date || new Date()).toISOString().split('T').shift();
  return new Date(d);
}
