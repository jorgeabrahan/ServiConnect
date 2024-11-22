import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { ProfessionalUserService } from './professional-user-service.entity';
import { ProfessionalUserServiceArea } from './professional-user-service-area.entity';
import { ProfessionalUserSchedule } from './professional-user-schedule.entity';

@Entity()
export class ProfessionalUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.professionalUser, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  status: 'idle' | 'pending' | 'approved' | 'denied';

  @OneToMany(
    () => ProfessionalUserService,
    (professionalUserService) => professionalUserService.professionalUser,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  professionalUserServices: ProfessionalUserService[];

  @OneToMany(
    () => ProfessionalUserServiceArea,
    (professionalUserServiceArea) =>
      professionalUserServiceArea.professionalUser,
    { onDelete: 'CASCADE' },
  )
  professionalUserServiceAreas: ProfessionalUserServiceArea[];

  @OneToMany(
    () => ProfessionalUserSchedule,
    (professionalUserSchedule) => professionalUserSchedule.professionalUser,
    { onDelete: 'CASCADE' },
  )
  professionalUserSchedules: ProfessionalUserSchedule[];
}
