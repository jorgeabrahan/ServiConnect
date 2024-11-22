import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { ServiceTrait } from './service-trait.entity';
import { ServiceSpecificationAmount } from './service-specification-amount.entity';
import { ServiceFAQ } from './service-faq.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category, (category) => category.services)
  category: string;

  @Column()
  image: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('int')
  minHoursToBook: number;

  @Column('int')
  maxHoursToBook: number;

  @Column('time')
  minTimeToSchedule: string;

  @Column('time')
  maxTimeToSchedule: string;

  @Column('float')
  hourlyRate: number;

  @OneToMany(() => ServiceTrait, (serviceTrait) => serviceTrait.service, {
    onDelete: 'CASCADE',
  })
  serviceTraits: ServiceTrait[];

  @OneToMany(
    () => ServiceSpecificationAmount,
    (serviceSpecificationAmount) => serviceSpecificationAmount.service,
    {
      onDelete: 'CASCADE',
    },
  )
  serviceSpecificationAmounts: ServiceSpecificationAmount[];

  @OneToMany(() => ServiceFAQ, (serviceFAQ) => serviceFAQ.service, {
    onDelete: 'CASCADE',
  })
  serviceFAQs: ServiceFAQ[];
}
