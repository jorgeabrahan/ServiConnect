import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProfessionalUserService,
  Service,
  ServiceFAQ,
  ServiceSpecificationAmount,
  ServiceTrait,
  ServiceTraitBulletPoint,
} from 'src/core/domain/entities';
import { Repository } from 'typeorm';
import {
  ServiceDto,
  ServiceFAQDto,
  ServiceSpecificationAmountDto,
  ServiceTraitDto,
} from './dto';
import { StandardApiResponse } from 'src/common/interfaces';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceTrait)
    private readonly serviceTraitRepository: Repository<ServiceTrait>,
    @InjectRepository(ServiceSpecificationAmount)
    private readonly serviceSpecificationAmountRepository: Repository<ServiceSpecificationAmount>,
    @InjectRepository(ServiceFAQ)
    private readonly serviceFAQRepository: Repository<ServiceFAQ>,
    @InjectRepository(ServiceTraitBulletPoint)
    private readonly serviceTraitBulletPointRepository: Repository<ServiceTraitBulletPoint>,
  ) {}

  async create(
    createServiceDto: ServiceDto,
  ): Promise<StandardApiResponse<Service>> {
    try {
      const service = this.serviceRepository.create(createServiceDto);
      return {
        isSuccess: true,
        data: await this.serviceRepository.save(service),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to create service';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async update(
    id: string,
    updateServiceDto: ServiceDto,
  ): Promise<StandardApiResponse<Service>> {
    try {
      const service = await this.serviceRepository.preload({
        id,
        ...updateServiceDto,
      });
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      return {
        isSuccess: true,
        data: await this.serviceRepository.save(service),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to update service';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async findOne(id: string): Promise<StandardApiResponse<Service>> {
    try {
      const service = await this.serviceRepository.findOne({
        where: { id },
        relations: [
          'serviceTraits',
          'serviceTraits.bulletPoints',
          'serviceSpecificationAmounts',
          'serviceFAQs',
        ],
      });
      if (!service) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }
      return {
        isSuccess: true,
        data: service,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to find service';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async delete(id: string): Promise<StandardApiResponse<Service>> {
    const queryRunner =
      this.serviceRepository.manager.connection.createQueryRunner();

    try {
      await queryRunner.startTransaction();

      const serviceToDelete = await queryRunner.manager.findOne(Service, {
        where: { id },
        relations: [
          'serviceTraits',
          'serviceTraits.bulletPoints',
          'serviceSpecificationAmounts',
          'serviceFAQs',
        ],
      });

      if (!serviceToDelete) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }

      const professionalUserService = await queryRunner.manager.findOne(
        ProfessionalUserService,
        {
          where: { service: { id } },
        },
      );
      if (professionalUserService) {
        throw new BadRequestException(
          `Service with ID ${id} can't be removed because it is already associated with a service provided by a professional user`,
        );
      }

      // Eliminar trait bullet points en paralelo
      const deleteTraitBulletPointsPromises = serviceToDelete.serviceTraits.map(
        (trait) => {
          return queryRunner.manager.remove(trait.bulletPoints);
        },
      );
      await Promise.all(deleteTraitBulletPointsPromises);

      // Eliminar service traits, specifications y FAQs en paralelo
      await Promise.all([
        queryRunner.manager.remove(serviceToDelete.serviceTraits),
        queryRunner.manager.remove(serviceToDelete.serviceSpecificationAmounts),
        queryRunner.manager.remove(serviceToDelete.serviceFAQs),
      ]);

      // Eliminar el servicio
      await queryRunner.manager.remove(serviceToDelete);

      await queryRunner.commitTransaction();
      return { isSuccess: true, data: serviceToDelete, error: null };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const fallbackErrorMessage = 'Failed to delete service';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    } finally {
      await queryRunner.release();
    }
  }

  /* SERVICE TRAITS */
  async addTrait(
    serviceId: string,
    serviceTraitDto: ServiceTraitDto,
  ): Promise<StandardApiResponse<ServiceTrait>> {
    try {
      const service = await this.serviceRepository.findOneBy({ id: serviceId });
      if (!service) {
        throw new NotFoundException(`Service with ID ${serviceId} not found`);
      }

      const { bulletPoints, ...restServiceTraitDto } = serviceTraitDto;
      const trait = this.serviceTraitRepository.create({
        ...restServiceTraitDto,
        service,
      });
      const savedTrait = await this.serviceTraitRepository.save(trait);

      if (bulletPoints) {
        const bulletPointsEntities = await Promise.all(
          bulletPoints.map((point) =>
            this.serviceTraitBulletPointRepository.create({
              title: point,
              serviceTrait: savedTrait.id,
            }),
          ),
        );
        savedTrait.bulletPoints =
          await this.serviceTraitBulletPointRepository.save(
            bulletPointsEntities,
          );
      }

      return { isSuccess: true, data: savedTrait, error: null };
    } catch (error) {
      return { isSuccess: false, data: null, error: error.message };
    }
  }

  async updateTrait(
    serviceId: string,
    id: string,
    serviceTraitDto: ServiceTraitDto,
  ): Promise<StandardApiResponse<ServiceTrait>> {
    try {
      const trait = await this.serviceTraitRepository.findOne({
        where: { id },
        relations: ['bulletPoints', 'service'],
      });

      if (!trait) {
        throw new NotFoundException(
          `Trait with ID ${id} belonging to service ${serviceId} not found`,
        );
      }

      if (trait.service.id !== serviceId) {
        throw new NotFoundException(
          `Trait with ID ${id} does not belong to service ${serviceId}`,
        );
      }

      const { bulletPoints, ...restServiceTraitDto } = serviceTraitDto;
      Object.assign(trait, restServiceTraitDto);

      await this.serviceTraitRepository.save(trait);

      if (bulletPoints) {
        await this.serviceTraitBulletPointRepository.remove(trait.bulletPoints);

        const bulletPointsEntities = await Promise.all(
          bulletPoints.map((point) =>
            this.serviceTraitBulletPointRepository.create({
              title: point,
              serviceTrait: trait.id,
            }),
          ),
        );

        trait.bulletPoints = await this.serviceTraitBulletPointRepository.save(
          bulletPointsEntities,
        );
      }

      return { isSuccess: true, data: trait, error: null };
    } catch (error) {
      return { isSuccess: false, data: null, error: error.message };
    }
  }

  async removeTrait(
    serviceId: string,
    id: string,
  ): Promise<StandardApiResponse<ServiceTrait>> {
    try {
      const trait = await this.serviceTraitRepository.findOne({
        where: { id },
        relations: ['service', 'bulletPoints'],
      });
      if (trait.service.id !== serviceId) {
        throw new NotFoundException(
          `Trait with ID ${id} does not belong to service ${serviceId}`,
        );
      }
      if (!trait)
        throw new NotFoundException(
          `Trait with ID ${id} belonging to service ${serviceId} not found`,
        );
      await this.serviceTraitBulletPointRepository.remove(trait.bulletPoints);
      await this.serviceTraitRepository.remove(trait);
      return { isSuccess: true, data: trait, error: null };
    } catch (error) {
      return { isSuccess: false, data: null, error: error.message };
    }
  }

  /* SERVICE SPECIFICATIONS */
  async addSpecification(
    serviceId: string,
    serviceSpecificationAmountDto: ServiceSpecificationAmountDto,
  ): Promise<StandardApiResponse<ServiceSpecificationAmount>> {
    try {
      const service = await this.serviceRepository.findOneBy({ id: serviceId });
      if (!service)
        throw new NotFoundException(`Service with ID ${serviceId} not found`);
      const isIntervalValid =
        serviceSpecificationAmountDto.max %
          serviceSpecificationAmountDto.interval ===
          0 &&
        serviceSpecificationAmountDto.interval <=
          serviceSpecificationAmountDto.max / 2;
      if (!isIntervalValid) {
        throw new BadRequestException(
          'Interval must be a divisor of max and interval must be less than or equal to half of max',
        );
      }
      const specification = this.serviceSpecificationAmountRepository.create({
        ...serviceSpecificationAmountDto,
        service,
      });
      return {
        isSuccess: true,
        data: await this.serviceSpecificationAmountRepository.save(
          specification,
        ),
        error: null,
      };
    } catch (error) {
      return { isSuccess: false, data: null, error: error.message };
    }
  }
  async updateSpecification(
    id: string,
    serviceSpecificationAmountDto: ServiceSpecificationAmountDto,
  ): Promise<StandardApiResponse<ServiceSpecificationAmount>> {
    try {
      const specification =
        await this.serviceSpecificationAmountRepository.preload({
          id,
          ...serviceSpecificationAmountDto,
        });
      if (!specification)
        throw new NotFoundException(`Specification with ID ${id} not found`);
      if (serviceSpecificationAmountDto.interval) {
        const max = serviceSpecificationAmountDto.max ?? specification.max;
        const isIntervalValid =
          max % serviceSpecificationAmountDto.interval === 0 &&
          serviceSpecificationAmountDto.interval <= max / 2;
        if (!isIntervalValid) {
          throw new BadRequestException(
            'Interval must be a divisor of max and interval must be less than or equal to half of max',
          );
        }
      }
      return {
        isSuccess: true,
        data: await this.serviceSpecificationAmountRepository.save(
          specification,
        ),
        error: null,
      };
    } catch (error) {
      return { isSuccess: false, data: null, error: error.message };
    }
  }
  async removeSpecification(
    id: string,
  ): Promise<StandardApiResponse<ServiceSpecificationAmount>> {
    try {
      const specification =
        await this.serviceSpecificationAmountRepository.findOneBy({ id });
      if (!specification)
        throw new NotFoundException(`Specification with ID ${id} not found`);
      await this.serviceSpecificationAmountRepository.remove(specification);
      return { isSuccess: true, data: specification, error: null };
    } catch (error) {
      return { isSuccess: false, data: null, error: error.message };
    }
  }

  /* SERVICE FAQs */
  async addFAQ(
    serviceId: string,
    serviceFAQDto: ServiceFAQDto,
  ): Promise<StandardApiResponse<ServiceFAQ>> {
    try {
      const service = await this.serviceRepository.findOneBy({ id: serviceId });
      if (!service)
        throw new NotFoundException(`Service with ID ${serviceId} not found`);
      const faq = this.serviceFAQRepository.create({
        ...serviceFAQDto,
        service,
      });
      return {
        isSuccess: true,
        data: await this.serviceFAQRepository.save(faq),
        error: null,
      };
    } catch (error) {
      return { isSuccess: false, data: null, error: error.message };
    }
  }
  async updateFAQ(
    id: string,
    serviceFAQDto: ServiceFAQDto,
  ): Promise<StandardApiResponse<ServiceFAQ>> {
    try {
      const faq = await this.serviceFAQRepository.preload({
        id,
        ...serviceFAQDto,
      });
      if (!faq) throw new NotFoundException(`FAQ with ID ${id} not found`);
      return {
        isSuccess: true,
        data: await this.serviceFAQRepository.save(faq),
        error: null,
      };
    } catch (error) {
      return { isSuccess: false, data: null, error: error.message };
    }
  }
  async removeFAQ(id: string): Promise<StandardApiResponse<ServiceFAQ>> {
    try {
      const faq = await this.serviceFAQRepository.findOneBy({ id });
      if (!faq) throw new NotFoundException(`FAQ with ID ${id} not found`);
      await this.serviceFAQRepository.remove(faq);
      return { isSuccess: true, data: faq, error: null };
    } catch (error) {
      return { isSuccess: false, data: null, error: error.message };
    }
  }
}
