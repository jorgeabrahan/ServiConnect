import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Service } from './service.entity';
import { ServiceTraitBulletPoint } from './service-trait-bullet-point.entity';

@Entity()
export class ServiceTrait {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Service, (service) => service.serviceTraits, {
    onDelete: 'CASCADE',
  })
  service: Service;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(
    () => ServiceTraitBulletPoint,
    (bulletPoint) => bulletPoint.serviceTrait,
    { onDelete: 'CASCADE' },
  )
  bulletPoints: ServiceTraitBulletPoint[];
}
