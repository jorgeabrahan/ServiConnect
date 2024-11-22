import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Service } from './service.entity';
import { ProfessionalUser } from './professional-user.entity';

@Entity()
export class ProfessionalUserService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Service)
  @JoinColumn()
  service: Service;

  @ManyToOne(
    () => ProfessionalUser,
    (professionalUser) => professionalUser.professionalUserServices,
  )
  professionalUser: ProfessionalUser;

  @Column('int')
  yearsOfExperience: number;

  @Column()
  description: string;
}
