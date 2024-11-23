import { CountryDepartmentCity } from './CountryDepartmentCity'
import { ProfessionalUser } from './ProfessionalUser'

export interface ProfessionalUserServiceArea {
  id: string
  countryDepartmentCity: CountryDepartmentCity
  professionalUser: ProfessionalUser
}
