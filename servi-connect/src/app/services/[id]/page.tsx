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
import { storeAuth } from '@/logic/stores'
import { createServiceRequest, getServiceById } from '@/logic/usecases'
import { redirect, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const formatDateForInput = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
const formatTimeForInput = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const today = new Date()

export default function ServiceDetails() {
  const params = useParams()
  const jwt = storeAuth((store) => store.jwt)
  const user = storeAuth((store) => store.user)
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  if (!id) redirect('/')
  const isAuthenticated = storeAuth((store) => store.isAuthenticated)
  const [isLoading, setIsLoading] = useState(false)
  const [service, setService] = useState<Service | null>(null)
  // time is 2 hours in the future
  const minBookingDate = new Date(today.getTime() + 2 * 60 * 60 * 1000)
  const { form, hoursBooked, date, time, description, onInputChange } =
    useControlledForm({
      hoursBooked: '',
      date: formatDateForInput(today),
      time: formatTimeForInput(minBookingDate),
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
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!service || !isAuthenticated || !user || !jwt) return
    if (
      service?.serviceSpecificationAmounts.length > 0 &&
      Object.keys(serviceSpecificationAmounts).length !==
        service?.serviceSpecificationAmounts.length
    ) {
      toast.error('Please select a value for each job specification')
      return
    }
    for (const value of Object.values(serviceSpecificationAmounts)) {
      if (value !== 'none' && value.trim().length > 0) continue
      return toast.error(
        'Please select a valid value for each job specification'
      )
    }
    if (
      Object.values(serviceSpecificationAmounts).every((value) => value === '0')
    ) {
      return toast.error(
        'At least one job specification must have a value greater than 0'
      )
    }
    const selectedDate = new Date(`${date}T${time}:00`)
    if (selectedDate < minBookingDate) {
      return toast.error('The service request date must be in the future.')
    }
    if (
      hoursBooked === 'none' ||
      hoursBooked.trim().length === 0 ||
      isNaN(Number(hoursBooked))
    ) {
      return toast.error('Please select a valid number of hours to book')
    }
    const newServiceRequest = {
      serviceId: service.id,
      description,
      date,
      time,
      hoursBooked: Number(hoursBooked),
      specificationAmounts: Object.entries(serviceSpecificationAmounts).map(
        ([key, value]) => {
          return {
            serviceSpecificationAmountId: key,
            value: Number(value)
          }
        }
      )
    }
    setIsLoading(true)
    const { isSuccess } = await createServiceRequest(
      newServiceRequest,
      user.id,
      jwt
    )
    if (isSuccess) redirect(`/dashboard`)
    setIsLoading(false)
  }
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
      <form className='grid gap-6 mb-20' onSubmit={onSubmit}>
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
                  options={[
                    { id: 'none', label: '[select amount]' },
                    ...Array((ss.max ?? 0) - (ss.min ?? 0) + 1)
                      .fill(null)
                      .map((_, index) => ({
                        id: `${(ss.min ?? 0) + index}`,
                        label: `${(ss.min ?? 0) + index}`
                      }))
                  ]}
                  disabled={isLoading}
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
              min={formatDateForInput(today)}
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
            <CxSelect
              id={form.hoursBooked.id}
              value={form.hoursBooked.value}
              onChange={onInputChange}
              label='Hours to book'
              options={[
                { id: 'none', label: '[select hours]' },
                ...Array(
                  (service?.maxHoursToBook ?? 0) -
                    (service?.minHoursToBook ?? 0) +
                    1
                )
                  .fill(null)
                  .map((_, index) => ({
                    id: `${(service?.minHoursToBook ?? 0) + index}`,
                    label: `${(service?.minHoursToBook ?? 0) + index} hours`
                  }))
              ]}
              required
              disabled={isLoading}
            />
          </div>
        </fieldset>
        <CxButton
          className='w-max ml-auto'
          type='submit'
          onClick={() => {
            if (!isAuthenticated)
              return toast.error('Please log in to request a service')
          }}
          disabled={isLoading}
        >
          Request service
        </CxButton>
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
