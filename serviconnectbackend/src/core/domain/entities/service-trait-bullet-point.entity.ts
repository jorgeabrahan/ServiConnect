import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ServiceTrait } from './service-trait.entity';

@Entity()
export class ServiceTraitBulletPoint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ServiceTrait, serviceTrait => serviceTrait.bulletPoints)
  serviceTrait: string;

  @Column()
  title: string;
}
