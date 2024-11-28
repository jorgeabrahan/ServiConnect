'use client'
import {
  ModalAddress,
  ModalAddServiceArea,
  WrapperContentDelimiter,
  WrapperProtectedRoute
} from '@/components'
import { CxButton } from '@/components/Interactions'
import { useUser } from '@/logic/hooks'
import { storeAuth, storeModalAddress } from '@/logic/stores'
import { ProfessionalUser } from './ProfessionalUser'

export default function Dashboard() {
  const openModalAddress = storeModalAddress((store) => store.open)
  const user = storeAuth((store) => store.user)
  const { userAddress, userProfessionalProfile } = useUser()
  return (
    <WrapperProtectedRoute>
      <WrapperContentDelimiter>
        <span className='text-sm px-3 py-[2px] bg-orange-200 rounded-full border border-solid border-orange-500 mb-1 block w-max'>
          {user?.role}
        </span>
        <h2 className='text-3xl font-semibold mb-3'>
          Hi {user?.firstName} {user?.lastName}!
        </h2>
        <div className='mb-2'>
          <span className='text-xs text-black/60'>Email:</span>
          <p>{user?.email}</p>
        </div>
        <div className='mb-2'>
          <span className='text-xs text-black/60'>Phone:</span>
          <p>
            +{user?.phoneNumberAreaCode} {user?.phoneNumber}
          </p>
        </div>
        <div className='mb-2'>
          <span className='text-xs text-black/60'>Description:</span>
          <p>{user?.description}</p>
        </div>
        {userAddress && (
          <>
            <div className='mb-2'>
              <span className='text-xs text-black/60'>Departamento:</span>
              <p>
                {userAddress?.countryDepartmentCity.countryDepartment.title}
              </p>
            </div>
            <div className='mb-2'>
              <span className='text-xs text-black/60'>Ciudad:</span>
              <p>{userAddress?.countryDepartmentCity.title}</p>
            </div>
            <div className='mb-2'>
              <span className='text-xs text-black/60'>Calle:</span>
              <p>{userAddress?.street}</p>
            </div>
            <div className='mb-2'>
              <span className='text-xs text-black/60'>Codigo postal:</span>
              <p>{userAddress?.postalCode}</p>
            </div>
          </>
        )}
        <CxButton
          onClick={() => {
            if (userAddress) return openModalAddress(userAddress)
            openModalAddress()
          }}
        >
          {userAddress ? 'Update' : 'Create'} address
        </CxButton>
        {!userProfessionalProfile?.id && (
          <CxButton>Become a professional</CxButton>
        )}
        {userProfessionalProfile?.id && <ProfessionalUser />}
      </WrapperContentDelimiter>
      <ModalAddServiceArea />
      <ModalAddress />
    </WrapperProtectedRoute>
  )
}
