import { User } from './User'
import { CountryDepartmentCity } from './CountryDepartmentCity'

export interface UserAddress {
  id: string
  user: User
  street: string
  neighborhood: string
  postalCode: string
  countryDepartmentCity: CountryDepartmentCity
}

export interface UserAddressDto {
  street: string
  neighborhood: string
  postalCode: string
  countryDepartmentCity: string
}
