import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export const HeaderActionPopover = ({
  label,
  items
}: {
  label: string
  items: {
    name: string
    description: string
    href: string
  }[]
}) => {
  return (
    <Popover className='relative'>
      <PopoverButton className='flex outline-none items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
        {label}
        <ChevronDownIcon
          aria-hidden='true'
          className='size-5 flex-none text-gray-400'
        />
      </PopoverButton>

      <PopoverPanel
        transition
        className='absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in'
      >
        <div className='p-4'>
          {items?.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className='block group relative rounded-lg p-2 text-sm/6 hover:bg-gray-50'
            >
              <h3 className='block font-semibold text-gray-900'>{item.name}</h3>
              <p className='text-gray-600'>{item.description}</p>
            </Link>
          ))}
        </div>
      </PopoverPanel>
    </Popover>
  )
}
