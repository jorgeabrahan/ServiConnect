import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryDepartmentService } from './country-department.service';
import { CountryDepartmentController } from './country-department.controller';
import {
  CountryDepartment,
  CountryDepartmentCity,
} from 'src/core/domain/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryDepartment, CountryDepartmentCity]),
  ],
  providers: [CountryDepartmentService],
  controllers: [CountryDepartmentController],
})
export class CountryDepartmentModule {}
