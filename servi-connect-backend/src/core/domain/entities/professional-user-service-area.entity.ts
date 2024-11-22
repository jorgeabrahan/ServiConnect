import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CountryDepartmentCity } from './country-department-city.entity';
import { ProfessionalUser } from './professional-user.entity';

@Entity()
export class ProfessionalUserServiceArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CountryDepartmentCity)
  countryDepartmentCity: CountryDepartmentCity;

  @ManyToOne(
    () => ProfessionalUser,
    (professionalUser) => professionalUser.professionalUserServiceAreas,
  )
  professionalUser: ProfessionalUser;
}
