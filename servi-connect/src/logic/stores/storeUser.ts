import { create } from 'zustand'
import {
  ProfessionalUser,
  ProfessionalUserServiceArea,
  UserAddress
} from '../entities'

interface StoreUser {
  userAddress: UserAddress | null
  userProfessionalProfile: ProfessionalUser | null
  setUserAddress: (userAddress: UserAddress | null) => void
  updateUserAddress: (userAddress: Omit<UserAddress, 'id' | 'user'>) => void
  setUserProfessionalProfile: (
    userProfessionalProfile: ProfessionalUser | null
  ) => void
  addUserProfessionalServiceArea: (
    serviceArea: ProfessionalUserServiceArea
  ) => void
  removeUserProfessionalServiceArea: (serviceAreaId: string) => void
}

export const storeUser = create<StoreUser>((set) => ({
  userAddress: null,
  userProfessionalProfile: null,
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
    }),
  setUserProfessionalProfile: (userProfessionalProfile) =>
    set({ userProfessionalProfile }),
  addUserProfessionalServiceArea: (serviceArea) =>
    set((state) => {
      if (!state.userProfessionalProfile) return state
      return {
        ...state,
        userProfessionalProfile: {
          ...state.userProfessionalProfile,
          professionalUserServiceAreas: [
            ...(state.userProfessionalProfile?.professionalUserServiceAreas ??
              []),
            serviceArea
          ]
        }
      }
    }),
  removeUserProfessionalServiceArea: (serviceAreaId) =>
    set((state) => {
      if (!state.userProfessionalProfile) return state
      return {
        ...state,
        userProfessionalProfile: {
          ...state.userProfessionalProfile,
          professionalUserServiceAreas:
            state.userProfessionalProfile.professionalUserServiceAreas.filter(
              (serviceArea) => serviceArea.id !== serviceAreaId
            )
        }
      }
    })
}))
