import { UserAddress } from '@/logic/entities/UserAddress'
import { create } from 'zustand'

interface StoreModalAddress {
  isEditing: boolean
  isOpen: boolean
  editingAddress: UserAddress | null
  open: (editingAddress?: UserAddress | null) => void
  close: () => void
}

export const storeModalAddress = create<StoreModalAddress>((set) => ({
  isEditing: false,
  isOpen: false,
  editingAddress: null,
  open: (editingAddress = null) =>
    set({ isEditing: editingAddress !== null, editingAddress, isOpen: true }),
  close: () => set({ isEditing: false, editingAddress: null, isOpen: false })
}))
