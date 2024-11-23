import { User } from './User'
import { ProfessionalUserService } from './ProfessionalUserService'
import { ProfessionalUserServiceArea } from './ProfessionalUserServiceArea'
import { ProfessionalUserSchedule } from './ProfessionalUserSchedule'

export interface ProfessionalUser {
  id: string
  user: User
  status: 'idle' | 'pending' | 'approved' | 'denied'
  professionalUserServices: ProfessionalUserService[]
  professionalUserServiceAreas: ProfessionalUserServiceArea[]
  professionalUserSchedules: ProfessionalUserSchedule[]
}
