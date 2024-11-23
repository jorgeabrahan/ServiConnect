import { ProfessionalUser } from './ProfessionalUser'

export interface ProfessionalUserSchedule {
  id: string
  professionalUser: ProfessionalUser
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday'
  startTime: string | null
  endTime: string | null
  isAvailable: boolean
}
