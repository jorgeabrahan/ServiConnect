import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import {
  Service,
  ServiceFAQ,
  ServiceSpecificationAmount,
  ServiceTrait,
  ServiceTraitBulletPoint,
} from 'src/core/domain/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      ServiceTrait,
      ServiceSpecificationAmount,
      ServiceFAQ,
      ServiceTraitBulletPoint
    ]),
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {}
