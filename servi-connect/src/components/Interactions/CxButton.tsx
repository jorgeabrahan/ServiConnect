'use client'
import { Button } from '@headlessui/react'

export const CxButton = ({
  className = '',
  onClick,
  type = 'button',
  children
}: {
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
}) => {
  return (
    <Button
      className={`inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white ${className}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </Button>
  )
}
