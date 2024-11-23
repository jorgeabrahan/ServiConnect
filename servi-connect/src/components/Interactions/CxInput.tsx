'use client'
import { WrapperInput } from '@/components/Wrappers'
import { Input } from '@headlessui/react'

export const CxInput = ({
  label,
  id,
  placeholder,
  value,
  type = 'text',
  onChange
}: {
  label: string
  id: string
  placeholder?: string
  value?: string
  type?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <WrapperInput label={label} id={id}>
      <Input
        type={type}
        name={id}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete='off'
        spellCheck='false'
        className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm'
      />
    </WrapperInput>
  )
}
