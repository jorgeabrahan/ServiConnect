import { useEffect } from 'react'
import { storeCategories } from '../stores/storeCategories'
import { getCategories } from '../usecases'

export const useCategories = () => {
  const isAlreadyFetched = storeCategories((store) => store.isAlreadyFetched)
  const categories = storeCategories((store) => store.categories)
  const setCategories = storeCategories((store) => store.setCategories)
  useEffect(() => {
    if (isAlreadyFetched) return
    const getAll = async () => {
      const res = await getCategories()
      if (!res.isSuccess) return
      setCategories(res.data ?? [])
    }
    getAll()
  }, [isAlreadyFetched, setCategories])
  return { categories }
}
