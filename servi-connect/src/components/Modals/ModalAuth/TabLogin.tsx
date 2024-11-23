'use client'
import { CxButton, CxInput } from '@/components/Interactions'
import { useControlledForm } from '@/logic/hooks'

import { FormEvent } from 'react'

export const TabLogin = () => {
  const { form, onInputChange } = useControlledForm({
    email: '',
    password: ''
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4 mb-4 max-h-[400px] overflow-y-auto'>
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
      </div>
      <CxButton className='justify-center w-full' type='submit'>
        Log in
      </CxButton>
    </form>
  )
}
