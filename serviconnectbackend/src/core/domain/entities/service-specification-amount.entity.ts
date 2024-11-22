import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Service } from './service.entity';

@Entity()
export class ServiceSpecificationAmount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Service, (service) => service.serviceSpecificationAmounts, {
    onDelete: 'CASCADE',
  })
  service: Service;

  @Column()
  title: string;

  @Column('int', { default: 1 })
  min: number;

  @Column('int', { default: 10 })
  max: number;

  @Column('float', { default: 0.5 })
  interval: number;
}
