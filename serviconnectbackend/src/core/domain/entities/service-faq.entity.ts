import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Service } from './service.entity';

@Entity()
export class ServiceFAQ {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Service, service => service.serviceFAQs, { onDelete: 'CASCADE' })
  service: Service;

  @Column()
  question: string;

  @Column()
  answer: string;
}
