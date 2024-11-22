import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequestService } from './service-request.service';
import { ServiceRequestController } from './service-request.controller';
import {
  ProfessionalUser,
  Service,
  ServiceRequest,
  ServiceRequestSpecificationAmount,
  User,
  UserReview,
} from 'src/core/domain/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceRequest,
      ProfessionalUser,
      User,
      UserReview,
      Service,
      ServiceRequestSpecificationAmount,
    ]),
  ],
  controllers: [ServiceRequestController],
  providers: [ServiceRequestService],
})
export class ServiceRequestModule {}
