import { create } from 'zustand'
import { CountryDepartment } from '../entities'

interface StoreCountryDepartments {
  isAlreadyFetched: boolean
  countryDepartments: CountryDepartment[]
  setCountryDepartments: (countryDepartments: CountryDepartment[]) => void
}

export const storeCountryDepartments = create<StoreCountryDepartments>(
  (set) => ({
    isAlreadyFetched: false,
    countryDepartments: [],
    setCountryDepartments: (countryDepartments: CountryDepartment[]) =>
      set({ countryDepartments })
  })
)
