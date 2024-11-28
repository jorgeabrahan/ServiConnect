import { useUser } from '@/logic/hooks'
import { CxButton, CxInput } from '@/components/Interactions'
import { FormEvent, useState } from 'react'
import { ProfessionalUserSchedule } from '@/logic/entities'

export const ProfessionalUserSchedules = () => {
  const { userProfessionalProfile } = useUser()
  const [schedules, setSchedules] = useState<
    Record<string, ProfessionalUserSchedule>
  >(() => {
    const initial: Record<string, ProfessionalUserSchedule> = {}
    userProfessionalProfile?.professionalUserSchedules?.forEach((schedule) => {
      initial[schedule.day] = schedule
    })
    return initial
  })
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(schedules)
  }
  return (
    <details className='mb-5' open>
      <summary className='cursor-pointer no-marker'>
        <h3 className='text-xl font-semibold'>Schedules</h3>
        <p className='text-sm text-black/60'>
          Set your availability to provide your services as a professional for
          all 7 days of the week.
        </p>
      </summary>
      <form className='grid gap-4 pt-4 mb-3' onSubmit={onSubmit}>
        {userProfessionalProfile?.professionalUserSchedules?.map((schedule) => (
          <div
            key={schedule.id}
            className='flex flex-col md:flex-row md:items-center gap-2'
          >
            <CxInput
              id={schedule.day}
              label='Day'
              value={`${schedules[schedule.day]?.day}`}
              disabled
            />
            <CxInput
              id={`${schedule.day}_startTime`}
              type='time'
              label='Start time'
              value={`${schedules[schedule.day]?.startTime}`}
              onChange={(e) => {
                setSchedules((prev) => ({
                  ...prev,
                  [schedule.day]: {
                    ...prev[schedule.day],
                    startTime: e.target.value
                  }
                }))
              }}
              disabled={!schedules[schedule.day]?.isAvailable}
            />
            <CxInput
              id={`${schedule.day}_endTime`}
              type='time'
              label='End time'
              value={`${schedules[schedule.day]?.endTime}`}
              onChange={(e) => {
                setSchedules((prev) => ({
                  ...prev,
                  [schedule.day]: {
                    ...prev[schedule.day],
                    endTime: e.target.value
                  }
                }))
              }}
              disabled={!schedules[schedule.day]?.isAvailable}
            />
            <div className='flex flex-col gap-1 items-start'>
              <label
                className='text-sm'
                htmlFor={`${schedule.day}_isAvailable`}
              >
                Is available
              </label>
              <input
                type='checkbox'
                id={`${schedule.day}_isAvailable`}
                name={`${schedule.day}_isAvailable`}
                checked={schedules[schedule.day]?.isAvailable}
                onChange={(e) => {
                  setSchedules((prev) => ({
                    ...prev,
                    [schedule.day]: {
                      ...prev[schedule.day],
                      isAvailable: e.target.checked
                    }
                  }))
                }}
              />
            </div>
          </div>
        ))}
        <CxButton className='w-max'>Update schedule</CxButton>
      </form>
    </details>
  )
}
