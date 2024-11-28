'use client'
import { WrapperModal } from '@/components/Wrappers'
import { HeaderModal } from '../HeaderModal'
import { CxButton, CxSelect } from '@/components/Interactions'
import { useStoreCountryDepartments, useUser } from '@/logic/hooks'
import { useState } from 'react'
import { storeAuth, storeModalAddServiceArea, storeUser } from '@/logic/stores'
import { createProfessionalUserServiceArea } from '@/logic/usecases'
import { toast } from 'sonner'

export const ModalAddServiceArea = () => {
  const user = storeAuth((store) => store.user)
  const jwt = storeAuth((store) => store.jwt)
  const addUserProfessionalServiceArea = storeUser(
    (store) => store.addUserProfessionalServiceArea
  )
  const { countryDepartments } = useStoreCountryDepartments()
  const { userProfessionalProfile } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [departmentId, setDepartmentId] = useState('')
  const [cityId, setCityId] = useState('')
  const [departmentCities, setDepartmentCities] = useState<
    { id: string; label: string }[]
  >([])
  const isOpen = storeModalAddServiceArea((store) => store.isOpen)
  const close = storeModalAddServiceArea((store) => store.close)
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (departmentId === 'none' || cityId === 'none')
      return toast.error('Select a valid department and city')
    const cd = countryDepartments.find((cd) => cd.id === departmentId)
    if (!cd) return toast.error('Select a valid department')
    const { cities } = cd
    const city = cities?.find((city) => city.id === cityId)
    if (!city) return toast.error('Select a valid city')
    const isAddedAlready =
      userProfessionalProfile?.professionalUserServiceAreas.find(
        (psa) => psa.countryDepartmentCity.id === cityId
      )
    if (isAddedAlready) return toast.error('Service area already added')
    if (!user || !jwt) return
    const newServiceArea = {
      countryDepartmentCityId: cityId
    }
    setIsLoading(true)
    const { isSuccess, data } = await createProfessionalUserServiceArea(
      user.id,
      newServiceArea,
      jwt
    )
    if (isSuccess && data) {
      addUserProfessionalServiceArea(data)
      close()
    }
    setIsLoading(false)
  }
  return (
    <WrapperModal open={isOpen}>
      <HeaderModal title={`Add address`} onClose={close} className='mb-4' />
      <form onSubmit={onSubmit}>
        <div className='flex flex-col gap-4 mb-4 max-h-[400px] overflow-y-auto'>
          <CxSelect
            label='Department'
            id={'departmentId'}
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value)
              setDepartmentCities(
                countryDepartments
                  .find((cd) => cd.id === e.target.value)
                  ?.cities?.map((city) => ({
                    id: city.id,
                    label: city.title
                  })) ?? []
              )
            }}
            options={[
              { id: 'none', label: '[select department]' },
              ...countryDepartments.map((cd) => ({
                id: cd.id,
                label: cd.title
              }))
            ]}
            disabled={isLoading}
            required
          />
          <CxSelect
            label='City'
            id={'cityId'}
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            options={[
              { id: 'none', label: '[select city]' },
              ...departmentCities
            ]}
            disabled={isLoading}
            required
          />
        </div>
        <CxButton
          className='justify-center w-full'
          type='submit'
          disabled={isLoading}
        >
          Add address
        </CxButton>
      </form>
    </WrapperModal>
  )
}
