'use client'
import { WrapperModal } from '@/components/Wrappers'
import { storeAuth, storeModalAddress, storeUser } from '@/logic/stores'
import { HeaderModal } from '../HeaderModal'
import { useControlledForm, useStoreCountryDepartments } from '@/logic/hooks'
import { FormEvent, useEffect, useState } from 'react'
import { CxButton, CxInput, CxSelect } from '@/components/Interactions'
import { createAddress, updateAddress } from '@/logic/usecases/user'
import { toast } from 'sonner'

export const ModalAddress = () => {
  const { countryDepartments } = useStoreCountryDepartments()
  const user = storeAuth((store) => store.user)
  const jwt = storeAuth((store) => store.jwt)
  const close = storeModalAddress((store) => store.close)
  const isEditing = storeModalAddress((store) => store.isEditing)
  const editingAddress = storeModalAddress((store) => store.editingAddress)
  const isOpen = storeModalAddress((store) => store.isOpen)
  const { form, setFormState, onInputChange } = useControlledForm({
    street: '',
    neighborhood: '',
    postalCode: ''
  })
  const updateUserAddress = storeUser((store) => store.updateUserAddress)
  const [isLoading, setIsLoading] = useState(false)
  const [departmentId, setDepartmentId] = useState('')
  const [cityId, setCityId] = useState('')
  const [departmentCities, setDepartmentCities] = useState<
    { id: string; label: string }[]
  >([])
  useEffect(() => {
    setDepartmentCities(
      countryDepartments
        .find(
          (cd) =>
            cd.id === editingAddress?.countryDepartmentCity.countryDepartment.id
        )
        ?.cities?.map((city) => ({ id: city.id, label: city.title })) ?? []
    )
    if (
      isEditing &&
      editingAddress &&
      departmentId ===
        editingAddress.countryDepartmentCity.countryDepartment.id &&
      cityId === ''
    ) {
      setCityId(editingAddress.countryDepartmentCity.id)
      return
    }
  }, [departmentId])
  useEffect(() => {
    if (!isEditing || !editingAddress) return
    setFormState({
      street: editingAddress.street,
      neighborhood: editingAddress.neighborhood,
      postalCode: editingAddress.postalCode
    })
    setDepartmentId(editingAddress.countryDepartmentCity.countryDepartment.id)
  }, [isEditing, editingAddress, setFormState])
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (departmentId === 'none' || cityId === 'none')
      return toast.error('Select a valid department and city')
    const cd = countryDepartments.find((cd) => cd.id === departmentId)
    if (!cd) return toast.error('Select a valid department')
    const { cities, ...countryDepartment } = cd
    const city = cities?.find((city) => city.id === cityId)
    if (!city) return toast.error('Select a valid city')

    if (!user || !jwt) return
    const newAddress = {
      street: form.street.value,
      neighborhood: form.neighborhood.value,
      postalCode: form.postalCode.value,
      countryDepartmentCity: cityId
    }
    let res
    setIsLoading(true)
    if (isEditing) {
      if (!editingAddress) return toast.error('Address not found')
      res = await updateAddress(user?.id, editingAddress?.id, newAddress, jwt)
    } else {
      res = await createAddress(user.id, newAddress, jwt)
    }
    if (res.isSuccess) {
      updateUserAddress({
        street: form.street.value,
        neighborhood: form.neighborhood.value,
        postalCode: form.postalCode.value,
        countryDepartmentCity: { ...city, countryDepartment }
      })
      close()
    }
    setIsLoading(false)
  }
  return (
    <WrapperModal open={isOpen} onClose={close}>
      <HeaderModal
        title={`${isEditing ? 'Actualizar' : 'Crear'} dirección`}
        onClose={close}
      />
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 mb-4 max-h-[400px] overflow-y-auto'>
          <CxInput
            label='Street'
            id={form.street.id}
            value={form.street.value}
            onChange={onInputChange}
            disabled={isLoading}
            required
          />
          <CxInput
            label='Neighborhood'
            id={form.neighborhood.id}
            value={form.neighborhood.value}
            onChange={onInputChange}
            disabled={isLoading}
            required
          />
          <CxInput
            label='Postal code'
            id={form.postalCode.id}
            value={form.postalCode.value}
            onChange={onInputChange}
            disabled={isLoading}
            required
          />
          <CxSelect
            label='Department'
            id={'departmentId'}
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
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
          {isEditing ? 'Actualizar' : 'Crear'} dirección
        </CxButton>
      </form>
    </WrapperModal>
  )
}
