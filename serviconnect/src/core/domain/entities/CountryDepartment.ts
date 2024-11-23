import { CountryDepartmentCity } from './CountryDepartmentCity'

export interface CountryDepartment {
  id: string
  title: string
  cities: CountryDepartmentCity[]
}
