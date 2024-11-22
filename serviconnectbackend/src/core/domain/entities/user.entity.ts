import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserAddress } from './user-address.entity';
import { ProfessionalUser } from './professional-user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column({ default: '504' })
  phoneNumberAreaCode: string;

  @Column()
  email: string;

  @Column()
  description: string;

  @Column()
  role: 'superadmin' | 'admin' | 'user';

  @Column()
  password: string;

  @OneToOne(() => UserAddress, (address) => address.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  address: UserAddress;

  @OneToOne(
    () => ProfessionalUser,
    (professionalUser) => professionalUser.user,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  professionalUser: ProfessionalUser;
}
