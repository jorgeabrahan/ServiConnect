import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CountryDepartmentCity } from './country-department-city.entity';
import { User } from './user.entity';

@Entity()
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.address)
  user: User;

  @Column()
  street: string;

  @Column()
  neighborhood: string;

  @Column()
  postalCode: string;

  @ManyToOne(() => CountryDepartmentCity)
  countryDepartmentCity: string;
}
