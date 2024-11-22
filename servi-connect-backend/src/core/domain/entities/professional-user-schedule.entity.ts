import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProfessionalUser } from './professional-user.entity';

@Entity()
export class ProfessionalUserSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => ProfessionalUser,
    (professionalUser) => professionalUser.professionalUserSchedules,
  )
  professionalUser: ProfessionalUser;

  @Column({
    type: 'enum',
    enum: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
  })
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

  @Column('time', { nullable: true })
  startTime: string | null;

  @Column('time', { nullable: true })
  endTime: string | null;

  @Column({ default: true })
  isAvailable: boolean;
}
