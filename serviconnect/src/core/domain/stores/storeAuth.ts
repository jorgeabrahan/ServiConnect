import { create } from 'zustand'
import { User } from '../entities'

interface AuthState {
  user: User | null
  jwt: string | null
  isAuthenticated: boolean
  login: (user: User, jwt: string) => void
  logout: () => void
}

export const storeAuth = create<AuthState>((set) => ({
  user: null,
  jwt: null,
  isAuthenticated: false,
  login: (user, jwt) => set({ user, jwt, isAuthenticated: true }),
  logout: () => set({ user: null, jwt: null, isAuthenticated: false })
}))
