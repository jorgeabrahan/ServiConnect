import { create } from 'zustand'

type StoreModalAuthTab = 'login' | 'signup'
interface StoreModalAuth {
  isOpen: boolean
  tab: StoreModalAuthTab
  open: (tab: StoreModalAuthTab) => void
  close: () => void
}

export const storeModalAuth = create<StoreModalAuth>((set) => ({
  isOpen: false,
  tab: 'login',
  open: (tab: StoreModalAuthTab = 'login') => set({ isOpen: true, tab }),
  close: () => set({ isOpen: false })
}))
