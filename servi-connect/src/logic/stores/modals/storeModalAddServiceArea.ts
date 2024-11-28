import { create } from 'zustand'

interface StoreModalAddServiceArea {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const storeModalAddServiceArea = create<StoreModalAddServiceArea>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
  })
)
