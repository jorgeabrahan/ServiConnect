import { useEffect } from 'react'
import { storeAuth, storeUser } from '../stores'
import { getUserAddress } from '../usecases/user'

export const useUser = () => {
  const jwt = storeAuth((store) => store.jwt)
  const user = storeAuth((store) => store.user)
  const userAddress = storeUser((store) => store.userAddress)
  const setUserAddress = storeUser((store) => store.setUserAddress)
  useEffect(() => {
    if (userAddress || !user || !jwt) return
    const get = async () => {
      const res = await getUserAddress(user.id, jwt)
      if (!res.isSuccess) return
      setUserAddress(res.data ?? null)
    }
    get()
  }, [jwt, user, userAddress, setUserAddress])
  return { userAddress }
}
