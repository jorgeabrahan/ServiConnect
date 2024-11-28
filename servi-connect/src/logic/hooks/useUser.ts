import { useEffect } from 'react'
import { storeAuth, storeUser } from '../stores'
import { getUserAddress } from '../usecases/user'
import { getProfessionalUser } from '../usecases'

export const useUser = () => {
  const jwt = storeAuth((store) => store.jwt)
  const user = storeAuth((store) => store.user)
  const userProfessionalProfile = storeUser(
    (store) => store.userProfessionalProfile
  )
  const setUserProfessionalProfile = storeUser(
    (store) => store.setUserProfessionalProfile
  )
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
  useEffect(() => {
    if (userProfessionalProfile || !user || !jwt) return
    const get = async () => {
      const res = await getProfessionalUser(user.id, jwt)
      if (!res.isSuccess) return
      setUserProfessionalProfile(res.data ?? null)
    }
    get()
  }, [])

  return { userAddress, userProfessionalProfile }
}
