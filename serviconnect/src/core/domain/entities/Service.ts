import { Category } from './Category'
import { ServiceTrait } from './ServiceTrait'
import { ServiceSpecificationAmount } from './ServiceSpecificationAmount'
import { ServiceFAQ } from './ServiceFAQ'

export interface Service {
  id: string
  category: Category
  image: string
  title: string
  description: string
  minHoursToBook: number
  maxHoursToBook: number
  minTimeToSchedule: string
  maxTimeToSchedule: string
  hourlyRate: number
  serviceTraits: ServiceTrait[]
  serviceSpecificationAmounts: ServiceSpecificationAmount[]
  serviceFAQs: ServiceFAQ[]
}
