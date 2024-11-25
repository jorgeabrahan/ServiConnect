'use client'
import { WrapperContentDelimiter } from '@/components'
import {
  CxButton,
  CxInput,
  CxSelect,
  CxTextarea
} from '@/components/Interactions'
import { Service } from '@/logic/entities'
import { useControlledForm } from '@/logic/hooks'
import { getServiceById } from '@/logic/usecases'
import { redirect, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ServiceDetails() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  if (!id) redirect('/')
  const [service, setService] = useState<Service | null>(null)
  const { form, onInputChange } = useControlledForm({
    hoursBooked: '',
    date: '',
    time: '',
    description: ''
  })
  const [serviceSpecificationAmounts, setServiceSpecificationAmounts] =
    useState<Record<string, string>>({})
  useEffect(() => {
    const get = async () => {
      const res = await getServiceById(id)
      setService(res.data ?? null)
    }
    get()
  }, [id])
  console.log(service)
  return (
    <WrapperContentDelimiter>
      <img
        src={service?.image}
        alt={service?.title}
        className='w-full h-[400px] object-cover rounded-lg'
      />
      <div className='py-6'>
        <h1 className='text-4xl font-bold mb-1'>{service?.title}</h1>
        <p className='text-sm text-black/60'>{service?.description}</p>
      </div>
      <form className='grid gap-6 mb-20'>
        {(service?.serviceSpecificationAmounts?.length ?? 0) > 0 && (
          <fieldset>
            <legend className='font-semibold text-lg mb-2'>
              Job specifications
            </legend>
            <div className='grid gap-3'>
              {service?.serviceSpecificationAmounts.map((ss) => (
                <CxSelect
                  key={ss.id}
                  label={ss.title}
                  id={ss.id}
                  value={`${serviceSpecificationAmounts[ss.id] ?? ''}`}
                  onChange={(e) =>
                    setServiceSpecificationAmounts({
                      ...serviceSpecificationAmounts,
                      [ss.id]: e.target.value
                    })
                  }
                  options={Array((ss.max ?? 0) - (ss.min ?? 0) + 1)
                    .fill(null)
                    .map((_, index) => ({
                      id: `${(ss.min ?? 0) + index}`,
                      label: `${(ss.min ?? 0) + index}`
                    }))}
                  required
                />
              ))}
            </div>
          </fieldset>
        )}
        <fieldset>
          <legend className='font-semibold text-lg mb-2'>Job schedule</legend>
          <div className='grid gap-3'>
            <CxInput
              id={form.date.id}
              value={form.date.value}
              onChange={onInputChange}
              label='Date to schedule'
              type='date'
              required
            />
            <CxInput
              id={form.time.id}
              value={form.time.value}
              onChange={onInputChange}
              label='Time to schedule'
              type='time'
              min={service?.minTimeToSchedule}
              max={service?.maxTimeToSchedule}
              required
            />
          </div>
        </fieldset>
        <fieldset>
          <legend className='font-semibold text-lg mb-2'>Other</legend>
          <div className='grid gap-3'>
            <CxTextarea
              id={form.description.id}
              value={form.description.value}
              label='Description'
              onChange={onInputChange}
              required
            />
            <CxSelect
              id={form.hoursBooked.id}
              value={form.hoursBooked.value}
              onChange={onInputChange}
              label='Hours to book'
              options={Array(
                (service?.maxHoursToBook ?? 0) -
                  (service?.minHoursToBook ?? 0) +
                  1
              )
                .fill(null)
                .map((_, index) => ({
                  id: `${(service?.minHoursToBook ?? 0) + index}`,
                  label: `${(service?.minHoursToBook ?? 0) + index} hours`
                }))}
              required
            />
          </div>
        </fieldset>
        <CxButton className='w-max ml-auto'>Request service</CxButton>
      </form>

      {(service?.serviceTraits?.length ?? 0) > 0 && (
        <section>
          <h3 className='text-3xl font-semibold mb-4'>Service traits</h3>
          <div className='grid gap-6 mb-20'>
            {service?.serviceTraits.map((trait) => (
              <div key={trait.id}>
                <h3 className='text-lg font-semibold'>{trait.title}</h3>
                <p className='text-sm'>{trait.description}</p>
                {trait?.bulletPoints?.length > 0 && (
                  <ul className='list-disc list-inside text-sm text-black/60'>
                    {trait.bulletPoints?.map((bp) => (
                      <li key={bp.id}>{bp.title}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {(service?.serviceFAQs?.length ?? 0) > 0 && (
        <section>
          <h3 className='text-3xl font-semibold mb-4'>Service FAQs</h3>
          <div className='grid gap-6 mb-20'>
            {service?.serviceFAQs.map((faq) => (
              <details key={faq.id}>
                <summary className='text-lg font-semibold'>
                  {faq.question}
                </summary>
                <p className='text-sm'>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </WrapperContentDelimiter>
  )
}
