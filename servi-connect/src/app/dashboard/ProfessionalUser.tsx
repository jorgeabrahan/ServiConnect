import { useUser } from '@/logic/hooks'
import { ProfessionalUserSchedules } from './ProfessionalUserSchedules'
import { ProfessionalUserServiceAreas } from './ProfessionalUserServiceAreas'

export const ProfessionalUser = () => {
  const { userProfessionalProfile } = useUser()
  return (
    <section className='py-10'>
      <h2 className='text-2xl font-semibold mb-5'>Professional user profile</h2>
      <ProfessionalUserSchedules />
      <ProfessionalUserServiceAreas />
      {userProfessionalProfile?.professionalUserServices?.map((service) => (
        <div key={service.id}>
          <p>{service.service.title}</p>
          <p>{service.description}</p>
          <p>{service.yearsOfExperience}</p>
        </div>
      ))}
    </section>
  )
}
