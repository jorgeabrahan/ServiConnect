'use client'
import { CxButton, CxInput, CxTextarea } from '@/components/Interactions'
import { useControlledForm } from '@/logic/hooks'
import { FormEvent } from 'react'

export const TabSignUp = () => {
  const { form, onInputChange } = useControlledForm({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    description: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4 mb-4 max-h-[400px] overflow-y-auto'>
        <CxInput
          label='First name'
          id={form.firstName.id}
          value={form.firstName.value}
          onChange={onInputChange}
        />
        <CxInput
          label='Last name'
          id={form.lastName.id}
          value={form.lastName.value}
          onChange={onInputChange}
        />
        <CxInput
          label='Phone number'
          id={form.phoneNumber.id}
          value={form.phoneNumber.value}
          onChange={onInputChange}
          type='tel'
        />
        <CxTextarea
          label='Description'
          id={form.description.id}
          value={form.description.value}
          onChange={onInputChange}
        />
        <CxInput
          label='Email'
          id={form.email.id}
          value={form.email.value}
          onChange={onInputChange}
        />
        <CxInput
          label='Password'
          id={form.password.id}
          value={form.password.value}
          onChange={onInputChange}
          type='password'
        />
        <CxInput
          label='Password confirmation'
          id={form.passwordConfirmation.id}
          value={form.passwordConfirmation.value}
          onChange={onInputChange}
          type='password'
        />
      </div>
      <CxButton className='justify-center w-full' type='submit'>
        Sign up
      </CxButton>
    </form>
  )
}
