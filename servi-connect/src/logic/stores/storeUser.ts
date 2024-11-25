import { create } from 'zustand'
import { UserAddress } from '../entities/UserAddress'

interface StoreUser {
  userAddress: UserAddress | null
  setUserAddress: (userAddress: UserAddress | null) => void
  updateUserAddress: (userAddress: Omit<UserAddress, 'id' | 'user'>) => void
}

export const storeUser = create<StoreUser>((set) => ({
  userAddress: null,
  setUserAddress: (userAddress) => set({ userAddress }),
  updateUserAddress: (userAddressDto) =>
    set((state) => {
      if (!state.userAddress) return state
      return {
        ...state,
        userAddress: {
          ...state.userAddress,
          street: userAddressDto.street,
          neighborhood: userAddressDto.neighborhood,
          postalCode: userAddressDto.postalCode,
          countryDepartmentCity: userAddressDto.countryDepartmentCity
        }
      }
    })
}))
