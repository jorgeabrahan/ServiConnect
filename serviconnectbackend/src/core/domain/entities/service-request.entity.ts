import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { Service } from './service.entity';
import { User } from './user.entity';
import { ServiceRequestSpecificationAmount } from './service-request-specification-amount.entity';
import { UserReview } from './user-review.entity';

@Entity()
export class ServiceRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Service)
  @JoinColumn()
  service: Service;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  professionalUser: User | null;

  @Column({ nullable: true })
  description: string | null;

  @Column('date')
  date: string;

  @Column('time')
  time: string;

  @Column('int')
  hoursBooked: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';

  @OneToMany(
    () => ServiceRequestSpecificationAmount,
    (serviceRequestSpecificationAmount) =>
      serviceRequestSpecificationAmount.serviceRequest,
  )
  serviceRequestSpecificationAmounts: ServiceRequestSpecificationAmount[];

  @OneToOne(() => UserReview, (userReview) => userReview.serviceRequest, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userReview: UserReview;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
