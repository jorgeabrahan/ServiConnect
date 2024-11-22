'use client'

import { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel
} from '@headlessui/react'
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  SquaresPlusIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { storeAuth, storeModalAuth } from '@/logic/stores'
import { CxButton } from '../Interactions'
import { getCategories } from '@/logic/usecases'

const actions = [
  {
    id: 'categories',
    label: 'Categories',
    items: [
      {
        name: 'Analytics',
        description: 'Get a better understanding of your traffic',
        href: '#',
        icon: ChartPieIcon
      },
      {
        name: 'Engagement',
        description: 'Speak directly to your customers',
        href: '#',
        icon: CursorArrowRaysIcon
      },
      {
        name: 'Integrations',
        description: 'Connect with third-party tools',
        href: '#',
        icon: SquaresPlusIcon
      },
      {
        name: 'Automations',
        description: 'Build strategic funnels that will convert',
        href: '#',
        icon: ArrowPathIcon
      }
    ]
  },
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
  useEffect(() => {
    const a = async () => {
      const res = await getCategories()
      console.log(res)
      console.log(res.data)
    }
    a()
  }, [])
  return (
    <header className='bg-white'>
      <nav
        aria-label='Global'
        className='mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8'
      >
        <div className='flex lg:flex-1'>
          <a href='#' className='-m-1.5 p-1.5'>
            <span className='sr-only'>ServiConnect</span>
            <WrenchScrewdriverIcon className='size-8' />
          </a>
        </div>
        <div className='flex lg:hidden'>
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
          {actions.map((action) => {
            const actionItemsAmount = action.items?.length ?? 0
            if (actionItemsAmount === 0) {
              return (
                <a
                  key={action.id}
                  href={action.to}
                  className='text-sm/6 font-semibold text-gray-900'
                >
                  {action.label}
                </a>
              )
            }
            return (
              <Popover className='relative' key={action.id}>
                <PopoverButton className='flex outline-none items-center gap-x-1 text-sm/6 font-semibold text-gray-900'>
                  {action.label}
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
                    {action.items?.map((item) => (
                      <div
                        key={item.name}
                        className='group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50'
                      >
                        <div className='flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white'>
                          <item.icon
                            aria-hidden='true'
                            className='size-6 text-gray-600 group-hover:text-indigo-600'
                          />
                        </div>
                        <div className='flex-auto'>
                          <a
                            href={item.href}
                            className='block font-semibold text-gray-900'
                          >
                            {item.name}
                            <span className='absolute inset-0' />
                          </a>
                          <p className='mt-1 text-gray-600'>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverPanel>
              </Popover>
            )
          })}
        </PopoverGroup>
        <div className='hidden lg:flex lg:items-center lg:gap-2 lg:flex-1 lg:justify-end'>
          {isAuthenticated ? (
            <Button>
              <UserCircleIcon className='size-8' />
            </Button>
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
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className='lg:hidden'
      >
        <div className='fixed inset-0 z-10' />
        <DialogPanel className='fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <a href='#' className='-m-1.5 p-1.5'>
              <span className='sr-only'>ServiConnect</span>
              <WrenchScrewdriverIcon className='size-8' />
            </a>
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
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6'>
                {actions.map((action) => {
                  const actionItemsAmount = action.items?.length ?? 0
                  if (actionItemsAmount === 0) {
                    return (
                      <a
                        key={action.id}
                        href={action.to}
                        className='-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'
                      >
                        {action.label}
                      </a>
                    )
                  }
                  return (
                    <Disclosure as='div' className='-mx-3' key={action.id}>
                      <DisclosureButton className='group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50'>
                        {action.label}
                        <ChevronDownIcon
                          aria-hidden='true'
                          className='size-5 flex-none group-data-[open]:rotate-180'
                        />
                      </DisclosureButton>
                      <DisclosurePanel className='mt-2 space-y-2'>
                        {action.items?.map((item) => (
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
                })}
              </div>
              <div className='space-y-2 py-6'>
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
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
