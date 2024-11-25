import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export const HeaderActionDisclosure = ({
  label,
  items
}: {
  label: string
  items: { name: string; href: string }[]
}) => {
  return (
    <Disclosure as='div' className='-mx-3'>
      <DisclosureButton className='group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
        {label}
        <ChevronDownIcon
          aria-hidden='true'
          className='size-5 flex-none group-data-[open]:rotate-180'
        />
      </DisclosureButton>
      <DisclosurePanel className='mt-2 space-y-2'>
        {items?.map((item) => (
          <DisclosureButton
            key={item.name}
            as='a'
            href={item.href}
            className='block rounded-lg py-2 pl-6 pr-3 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50'
          >
            {item.name}
          </DisclosureButton>
        ))}
      </DisclosurePanel>
    </Disclosure>
  )
}
