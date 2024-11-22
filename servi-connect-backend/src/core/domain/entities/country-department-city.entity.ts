import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CountryDepartment } from './country-department.entity';

@Entity()
export class CountryDepartmentCity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CountryDepartment, department => department.cities)
  countryDepartment: CountryDepartment;

  @Column()
  title: string;
}
