import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { User } from './user.entity';

@Entity()
export class UserReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => ServiceRequest, (serviceRequest) => serviceRequest.userReview)
  serviceRequest: ServiceRequest;

  @Column()
  comment: string;

  @Column('int')
  score: number; // Range: 1-5
}
