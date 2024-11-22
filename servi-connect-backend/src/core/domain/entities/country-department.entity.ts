import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CountryDepartmentCity } from './country-department-city.entity';

@Entity()
export class CountryDepartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @OneToMany(() => CountryDepartmentCity, city => city.countryDepartment)
  cities: CountryDepartmentCity[];
}
