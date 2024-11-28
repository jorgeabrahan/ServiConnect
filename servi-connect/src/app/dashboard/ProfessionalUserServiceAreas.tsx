import { CxButton } from '@/components/Interactions'
import { useUser } from '@/logic/hooks'
import { storeAuth, storeModalAddServiceArea, storeUser } from '@/logic/stores'
import { deleteProfessionalUserServiceArea } from '@/logic/usecases'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export const ProfessionalUserServiceAreas = () => {
  const openModalAddServiceArea = storeModalAddServiceArea(
    (store) => store.open
  )
  const [isLoading, setIsLoading] = useState(false)
  const user = storeAuth((store) => store.user)
  const jwt = storeAuth((store) => store.jwt)
  const removeUserProfessionalServiceArea = storeUser(
    (store) => store.removeUserProfessionalServiceArea
  )
  const { userProfessionalProfile } = useUser()
  const onRemoveServiceArea = async (serviceAreaId: string) => {
    if (!user || !jwt) return
    setIsLoading(true)
    const { isSuccess } = await deleteProfessionalUserServiceArea(
      user?.id,
      serviceAreaId,
      jwt
    )
    if (isSuccess) removeUserProfessionalServiceArea(serviceAreaId)
    setIsLoading(false)
  }
  return (
    <details className='mb-5' open>
      <summary className='cursor-pointer no-marker'>
        <h3 className='text-xl font-semibold'>Service areas</h3>
        <p className='text-sm text-black/60'>
          Set the service areas where you can provide your services as a
          professional.
        </p>
      </summary>
      <div className='grid gap-4 pt-4 mb-3'>
        {userProfessionalProfile?.professionalUserServiceAreas?.map((area) => (
          <div className='flex items-center gap-3' key={area.id}>
            <CxButton
              onClick={() => onRemoveServiceArea(area.id)}
              disabled={isLoading}
            >
              <TrashIcon className='size-4' />
            </CxButton>
            <p>{area.countryDepartmentCity.countryDepartment.title}</p>
            <p> - </p>
            <p>{area.countryDepartmentCity.title}</p>
          </div>
        ))}
      </div>
      <CxButton disabled={isLoading} onClick={openModalAddServiceArea}>
        Add service area
      </CxButton>
    </details>
  )
}
