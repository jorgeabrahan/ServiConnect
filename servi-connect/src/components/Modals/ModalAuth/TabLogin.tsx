'use client'
import { CxButton, CxInput } from '@/components/Interactions'
import { useControlledForm } from '@/logic/hooks'
import { storeModalAuth } from '@/logic/stores'
import { login } from '@/logic/usecases'

import { FormEvent, useState } from 'react'

export const TabLogin = () => {
  const close = storeModalAuth((store) => store.close)
  const { form, email, password, onInputChange } = useControlledForm({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const { isSuccess } = await login({ email, password })
    setIsLoading(false)
    if (isSuccess) close()
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col gap-4 mb-4 max-h-[400px] overflow-y-auto'>
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
      </div>
      <CxButton
        className='justify-center w-full'
        type='submit'
        disabled={isLoading}
      >
        Log in
      </CxButton>
    </form>
  )
}
