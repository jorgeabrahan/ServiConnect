'use client'
import { WrapperInput } from '@/components/Wrappers'
import { Textarea } from '@headlessui/react'

export const CxTextarea = ({
  label,
  id,
  placeholder,
  value,
  onChange
}: {
  label: string
  id: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) => {
  return (
    <WrapperInput label={label} id={id}>
      <Textarea
        name={id}
        id={id}
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm resize-none'
      ></Textarea>
    </WrapperInput>
  )
}
