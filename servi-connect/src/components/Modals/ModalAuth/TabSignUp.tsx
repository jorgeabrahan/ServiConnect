'use client'
import { CxButton, CxInput, CxTextarea } from '@/components/Interactions'
import { useControlledForm } from '@/logic/hooks'
import { storeModalAuth } from '@/logic/stores'
import { signup } from '@/logic/usecases'
import { FormEvent, useState } from 'react'

export const TabSignUp = () => {
  const close = storeModalAuth((store) => store.close)
  const [isLoading, setIsLoading] = useState(false)
  const {
    form,
    firstName,
    lastName,
    phoneNumber,
    description,
    email,
    password,
    passwordConfirmation,
    onInputChange
  } = useControlledForm({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    description: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const { isSuccess } = await signup({
      firstName,
      lastName,
      phoneNumber,
      phoneNumberAreaCode: '504',
      description,
      email,
      password,
      passwordConfirmation
    })
    setIsLoading(false)
    if (isSuccess) close()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4 mb-4 max-h-[400px] overflow-y-auto'>
        <CxInput
          label='First name'
          id={form.firstName.id}
          value={form.firstName.value}
          onChange={onInputChange}
          disabled={isLoading}
          required
        />
        <CxInput
          label='Last name'
          id={form.lastName.id}
          value={form.lastName.value}
          onChange={onInputChange}
          disabled={isLoading}
          required
        />
        <CxInput
          label='Phone number'
          id={form.phoneNumber.id}
          value={form.phoneNumber.value}
          onChange={onInputChange}
          disabled={isLoading}
          type='tel'
          required
        />
        <CxTextarea
          label='Description'
          id={form.description.id}
          value={form.description.value}
          onChange={onInputChange}
          disabled={isLoading}
          required
        />
        <CxInput
          label='Email'
          id={form.email.id}
          value={form.email.value}
          onChange={onInputChange}
          disabled={isLoading}
          required
        />
        <CxInput
          label='Password'
          id={form.password.id}
          value={form.password.value}
          onChange={onInputChange}
          disabled={isLoading}
          type='password'
          required
        />
        <CxInput
          label='Password confirmation'
          id={form.passwordConfirmation.id}
          value={form.passwordConfirmation.value}
          onChange={onInputChange}
          disabled={isLoading}
          type='password'
          required
        />
      </div>
      <CxButton
        className='justify-center w-full'
        type='submit'
        disabled={isLoading}
      >
        Sign up
      </CxButton>
    </form>
  )
}
