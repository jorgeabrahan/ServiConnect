import { UserAddress } from './UserAddress'
import { ProfessionalUser } from './ProfessionalUser'

export interface User {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumberAreaCode: string
  email: string
  description: string
  role: 'superadmin' | 'admin' | 'user'
  address: UserAddress
  professionalUser: ProfessionalUser
}
