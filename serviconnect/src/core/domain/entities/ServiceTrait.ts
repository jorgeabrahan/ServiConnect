import { Service } from './Service'
import { ServiceTraitBulletPoint } from './ServiceTraitBulletPoint'

export interface ServiceTrait {
  id: string
  service: Service
  title: string
  description: string
  bulletPoints: ServiceTraitBulletPoint[]
}
