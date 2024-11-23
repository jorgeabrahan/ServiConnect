import { Service } from './Service'

export interface ServiceSpecificationAmount {
  id: string
  service: Service
  title: string
  min: number
  max: number
  interval: number
}
