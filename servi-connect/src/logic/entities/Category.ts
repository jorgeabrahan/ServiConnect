import { Service } from './Service'

export interface Category {
  id: string
  title: string
  description: string
  services: Service[]
}
