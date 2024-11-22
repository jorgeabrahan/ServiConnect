import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalUserController } from './professional-user.controller';
import {
  CountryDepartmentCity,
  ProfessionalUser,
  ProfessionalUserSchedule,
  ProfessionalUserService,
  ProfessionalUserServiceArea,
  User,
} from 'src/core/domain/entities';
import { ProfessionalService } from './professional-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      ProfessionalUser,
      ProfessionalUserService,
      ProfessionalUserServiceArea,
      CountryDepartmentCity,
      ProfessionalUserSchedule,
    ]),
  ],
  controllers: [ProfessionalUserController],
  providers: [ProfessionalService],
})
export class ProfessionalUserModule {}
