import { Service } from './Service'
import { ProfessionalUser } from './ProfessionalUser'

export interface ProfessionalUserService {
  id: string
  service: Service
  professionalUser: ProfessionalUser
  yearsOfExperience: number
  description: string
}
