'use client'

import { useState } from 'react'
import { Button, Dialog, DialogPanel, PopoverGroup } from '@headlessui/react'
import {
  Bars3Icon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { storeAuth, storeModalAuth } from '@/logic/stores'
import { CxButton } from '../Interactions'
import { useCategories } from '@/logic/hooks'
import { HeaderActionPopover } from './HeaderActionPopover'
import { HeaderActionDisclosure } from './HeaderActionDisclosure'
import Link from 'next/link'
import { WrapperContentDelimiter } from '../Wrappers'

const actions = [
  {
    id: 'about',
    label: 'About',
    to: '#'
  },
  {
    id: 'contact',
    label: 'Contact Us',
    to: '#'
  }
]
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAuthenticated = storeAuth((store) => store.isAuthenticated)
  const open = storeModalAuth((store) => store.open)
  const { categories } = useCategories()
  return (
    <header className='bg-white'>
      <WrapperContentDelimiter
        as='nav'
        className='flex items-center justify-between'
        matchBlockPadding
      >
        <div className='flex lg:flex-1'>
          <Link href='/' className='-m-1.5 p-1.5'>
            <span className='sr-only'>ServiConnect</span>
            <WrenchScrewdriverIcon className='size-8' />
          </Link>
        </div>
        <div className='flex items-center gap-2 lg:hidden'>
          {isAuthenticated && (
            <Link href='/dashboard'>
              <UserCircleIcon className='size-7' />
            </Link>
          )}
          <button
            type='button'
            onClick={() => setMobileMenuOpen(true)}
            className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
          >
            <span className='sr-only'>Open main menu</span>
            <Bars3Icon aria-hidden='true' className='size-8' />
          </button>
        </div>
        <PopoverGroup className='hidden lg:flex lg:gap-x-8'>
          <HeaderActionPopover
            label={'Categories'}
            items={categories.map((cat) => ({
              name: cat.title,
              description: cat.description,
              href: `/categories/${cat.id}`
            }))}
          />
          {actions.map((action) => (
            <Link
              key={action.id}
              href={action.to}
              className='text-sm/6 font-semibold text-gray-900'
            >
              {action.label}
            </Link>
          ))}
        </PopoverGroup>
        <div className='hidden lg:flex lg:items-center lg:gap-2 lg:flex-1 lg:justify-end'>
          {isAuthenticated ? (
            <Link href='/dashboard'>
              <UserCircleIcon className='size-8' />
            </Link>
          ) : (
            <>
              <Button
                className='inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold'
                onClick={() => open('login')}
              >
                Log in
              </Button>
              <CxButton onClick={() => open('signup')}>Sign up</CxButton>
            </>
          )}
        </div>
      </WrapperContentDelimiter>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className='lg:hidden'
      >
        <DialogPanel className='fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <Link href='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>ServiConnect</span>
              <WrenchScrewdriverIcon className='size-8' />
            </Link>
            <button
              type='button'
              onClick={() => setMobileMenuOpen(false)}
              className='-m-2.5 rounded-md p-2.5 text-gray-700'
            >
              <span className='sr-only'>Close menu</span>
              <XMarkIcon aria-hidden='true' className='size-8' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div
              className={`-my-6 ${
                !isAuthenticated && 'divide-y divide-gray-500/10'
              }`}
            >
              <div className='space-y-2 py-6'>
                <HeaderActionDisclosure
                  label={'Categories'}
                  items={categories.map((cat) => ({
                    name: cat.title,
                    href: `/categories/${cat.id}`
                  }))}
                />
                {actions.map((action) => (
                  <a
                    key={action.id}
                    href={action.to}
                    className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                  >
                    {action.label}
                  </a>
                ))}
              </div>
              <div className='space-y-2 py-6'>
                {!isAuthenticated && (
                  <>
                    <Button
                      className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                      onClick={() => open('login')}
                    >
                      Log in
                    </Button>
                    <Button
                      className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                      onClick={() => open('login')}
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
