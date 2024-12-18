import { create } from 'zustand'
import { User } from '../entities'

interface StoreAuth {
  user: User | null
  jwt: string | null
  isAuthenticated: boolean
  login: (user: User, jwt: string) => void
  logout: () => void
}

export const storeAuth = create<StoreAuth>((set) => ({
  user: null,
  jwt: null,
  isAuthenticated: false,
  login: (user, jwt) => set({ user, jwt, isAuthenticated: true }),
  logout: () => set({ user: null, jwt: null, isAuthenticated: false })
}))
