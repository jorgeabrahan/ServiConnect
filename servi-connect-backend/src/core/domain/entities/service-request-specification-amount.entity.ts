import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { ServiceSpecificationAmount } from './service-specification-amount.entity';

@Entity()
export class ServiceRequestSpecificationAmount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceRequest, (serviceRequest) => serviceRequest.serviceRequestSpecificationAmounts)
  serviceRequest: ServiceRequest;

  @ManyToOne(() => ServiceSpecificationAmount)
  @JoinColumn()
  serviceSpecificationAmount: ServiceSpecificationAmount;

  @Column('int')
  value: number;
}
