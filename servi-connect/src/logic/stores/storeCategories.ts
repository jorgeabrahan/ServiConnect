import { create } from 'zustand'
import { Category } from '../entities'

interface StoreCategories {
  isAlreadyFetched: boolean
  categories: Category[]
  setCategories: (categories: Category[]) => void
}

export const storeCategories = create<StoreCategories>((set) => ({
  isAlreadyFetched: false,
  categories: [],
  setCategories: (categories: Category[]) =>
    set({ categories, isAlreadyFetched: true })
}))
