import { useEffect } from 'react'
import { storeCountryDepartments } from '../stores'
import { getCountryDepartments } from '../usecases'

export const useStoreCountryDepartments = () => {
  const isAlreadyFetched = storeCountryDepartments(
    (store) => store.isAlreadyFetched
  )
  const countryDepartments = storeCountryDepartments(
    (store) => store.countryDepartments
  )
  const setCountryDepartments = storeCountryDepartments(
    (store) => store.setCountryDepartments
  )
  useEffect(() => {
    if (isAlreadyFetched) return
    const getAll = async () => {
      const res = await getCountryDepartments()
      if (!res.isSuccess) return
      setCountryDepartments(res.data ?? [])
    }
    getAll()
  }, [isAlreadyFetched, setCountryDepartments])
  return { countryDepartments }
}
