'use client'

import { WrapperContentDelimiter } from '@/components'
import { useCategories } from '@/logic/hooks'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const steps = [
  {
    title: 'Create account',
    description: 'Register in our platform and complete your profile.'
  },
  {
    title: 'Request service',
    description: 'Look for the service that you need and request it.'
  },
  {
    title: 'Get assigned a professional',
    description:
      "Once your request is approved, you'll be assigned a professional."
  }
]
export default function Home() {
  const { categories } = useCategories()
  return (
    <WrapperContentDelimiter>
      <article className='py-16 text-center'>
        <h1 className='text-3xl md:text-4xl font-bold mb-3'>
          We&apos;ll take care of your home
        </h1>
        <p className='text-black/60 max-w-[700px] mx-auto mb-14'>
          Here&apos;s how simple ServiConnect allows you to find the perfect
          professional for the service you need.
        </p>
        <section className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-w-[1000px] mx-auto gap-4'>
          {steps.map((step, index) => (
            <article className='text-center' key={index}>
              <span className='bg-black text-white font-mono font-bold w-10 h-10 flex items-center justify-center rounded-full mx-auto mb-2'>
                {index + 1}
              </span>
              <h2 className='text-xl font-semibold'>{step.title}</h2>
              <p className='text-sm black/60 max-w-[300px] mx-auto'>
                {step.description}
              </p>
            </article>
          ))}
        </section>
      </article>

      <section className='py-16'>
        <h2 className='text-3xl md:text-4xl font-bold mb-3 text-center'>
          Take a look at our services
        </h2>
        <div className='grid gap-14'>
          {categories.slice(0, 3).map((category) => (
            <div key={category.id}>
              <header className='mb-4'>
                <h3 className='text-2xl font-semibold'>{category.title}</h3>
                <p className='text-black/60'>{category.description}</p>
              </header>
              <div className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4'>
                {category.services.map((service) => (
                  <Link
                    href={`/services/${service.id}`}
                    className='relative rounded-lg overflow-hidden'
                    key={service.id}
                  >
                    <img
                      className='w-full max-h-[180px] object-cover'
                      src={service.image}
                      alt={service.title}
                    />
                    <div className='absolute bottom-0 w-full bg-black/60 text-white font-semibold p-2 flex justify-between items-center'>
                      <span>{service.title}</span>
                      <ChevronRightIcon className='size-5' />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </WrapperContentDelimiter>
  )
}
