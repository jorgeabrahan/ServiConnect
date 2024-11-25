import { create } from 'zustand'
import { Category } from '../entities'

interface StoreCategories {
  categories: Category[]
  setCategories: (categories: Category[]) => void
}

export const storeCategories = create<StoreCategories>((set) => ({
  categories: [],
  setCategories: (categories: Category[]) => set({ categories })
}))
