import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import {
  ProfessionalUser,
  Service,
  ServiceRequest,
  ServiceRequestSpecificationAmount,
  User,
  UserReview,
} from 'src/core/domain/entities';
import { StandardApiResponse } from 'src/common/interfaces';
import { CreateReviewDto } from './dto';

@Injectable()
export class ServiceRequestService {
  constructor(
    @InjectRepository(ServiceRequest)
    private readonly serviceRequestRepository: Repository<ServiceRequest>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(ServiceRequestSpecificationAmount)
    private readonly serviceRequestSpecificationAmountRepository: Repository<ServiceRequestSpecificationAmount>,
    @InjectRepository(UserReview)
    private readonly userReviewRepository: Repository<UserReview>,
    @InjectRepository(ProfessionalUser)
    private readonly professionalUserRepository: Repository<ProfessionalUser>,
  ) {}

  async createServiceRequest(
    userId: string,
    dto: CreateServiceRequestDto,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      const service = await this.serviceRepository.findOne({
        where: { id: dto.serviceId },
        relations: ['serviceSpecificationAmounts'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      if (!service) {
        throw new NotFoundException(
          `Service with ID ${dto.serviceId} not found`,
        );
      }

      const today = new Date();
      const minBookingDate = new Date(today.getTime() + 2 * 60 * 60 * 1000);
      const requestedTime = new Date(`${dto.date}T${dto.time}`);
      if (requestedTime < minBookingDate) {
        throw new BadRequestException(
          'The requested service time must be at least 2 hours in the future.',
        );
      }

      if (
        dto.time < service.minTimeToSchedule ||
        dto.time > service.maxTimeToSchedule
      ) {
        throw new BadRequestException(
          `The requested service time must be between ${service.minTimeToSchedule} and ${service.maxTimeToSchedule}`,
        );
      }

      if (
        dto.hoursBooked < service.minHoursToBook ||
        dto.hoursBooked > service.maxHoursToBook
      ) {
        throw new BadRequestException(
          `The requested number of hours must be between ${service.minHoursToBook} and ${service.maxHoursToBook}`,
        );
      }

      const serviceSpecAmountIds = service.serviceSpecificationAmounts.map(
        (spec) => spec.id,
      );
      const dtoSpecAmountIds = dto.specificationAmounts.map(
        (spec) => spec.serviceSpecificationAmountId,
      );
      if (
        dto.specificationAmounts.length !==
        service.serviceSpecificationAmounts.length
      ) {
        throw new BadRequestException(
          `The number of specification amounts does not match the expected number for the service`,
        );
      }
      for (const id of dtoSpecAmountIds) {
        if (!serviceSpecAmountIds.includes(id)) {
          throw new BadRequestException(
            `Invalid service specification amount ID: ${id}`,
          );
        }
      }

      const serviceRequest = this.serviceRequestRepository.create({
        user,
        service,
        description: dto.description ?? null,
        date: dto.date,
        time: dto.time,
        hoursBooked: dto.hoursBooked,
        status: 'pending',
      });

      const savedServiceRequest = await this.serviceRequestRepository.save(
        serviceRequest,
      );

      const specificationAmounts = dto.specificationAmounts.map((spec) => {
        return this.serviceRequestSpecificationAmountRepository.create({
          serviceRequest: savedServiceRequest,
          serviceSpecificationAmount: {
            id: spec.serviceSpecificationAmountId,
          },
          value: spec.value,
        });
      });

      await this.serviceRequestSpecificationAmountRepository.save(
        specificationAmounts,
      );

      const fullServiceRequest = await this.serviceRequestRepository.findOne({
        where: { id: savedServiceRequest.id },
        relations: [
          'service',
          'user',
          'serviceRequestSpecificationAmounts',
          'serviceRequestSpecificationAmounts.serviceSpecificationAmount',
        ],
      });

      return {
        isSuccess: true,
        data: fullServiceRequest,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to create service request for user ID ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async getAvailableProfessionalUsersForServiceRequest(
    requestId: string,
  ): Promise<StandardApiResponse<ProfessionalUser[]>> {
    try {
      const serviceRequest = await this.serviceRequestRepository.findOne({
        where: { id: requestId },
        relations: ['user', 'service'],
      });

      if (!serviceRequest) {
        throw new NotFoundException(
          `Service request with ID ${requestId} not found`,
        );
      }

      const serviceDate = new Date(
        `${serviceRequest.date}T${serviceRequest.time}`,
      );
      const dayOfWeek = serviceDate
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();

      const userCity = serviceRequest.user.address.countryDepartmentCity;

      const availableUsers = await this.professionalUserRepository
        .createQueryBuilder('professionalUser')
        .leftJoinAndSelect(
          'professionalUser.professionalUserServices',
          'professionalUserServices',
        )
        .leftJoinAndSelect(
          'professionalUser.professionalUserServiceAreas',
          'professionalUserServiceAreas',
        )
        .leftJoinAndSelect(
          'professionalUser.professionalUserSchedules',
          'professionalUserSchedules',
        )
        .where('professionalUser.status = :status', { status: 'approved' })
        .andWhere('professionalUserServices.service.id = :serviceId', {
          serviceId: serviceRequest.service.id,
        })
        .andWhere(
          'professionalUserServiceAreas.countryDepartmentCity.id = :userCity',
          { userCity },
        )
        .andWhere('professionalUserSchedules.day = :dayOfWeek', { dayOfWeek })
        .andWhere('professionalUserSchedules.isAvailable = true')
        .andWhere(
          'professionalUserSchedules.startTime <= :requestTime AND professionalUserSchedules.endTime >= :endRequestTime',
          {
            requestTime: serviceRequest.time,
            endRequestTime: new Date(
              serviceDate.getTime() +
                serviceRequest.hoursBooked * 60 * 60 * 1000,
            )
              .toISOString()
              .split('T')[1],
          },
        )
        .orderBy('professionalUserServices.yearsOfExperience', 'DESC')
        .getMany();

      return {
        isSuccess: true,
        data: availableUsers,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to get available professional users for service request with ID ${requestId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async getServiceRequestById(
    requestId: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    try {
      const serviceRequest = await this.serviceRequestRepository.findOne({
        where: { id: requestId },
        relations: [
          'service',
          'user',
          'professionalUser',
          'serviceRequestSpecificationAmounts',
          'serviceRequestSpecificationAmounts.serviceSpecificationAmount',
          'userReview',
        ],
      });

      if (!serviceRequest) {
        throw new NotFoundException(
          `Service request with ID ${requestId} not found`,
        );
      }

      return {
        isSuccess: true,
        data: serviceRequest,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to get service request with ID ${requestId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async getServiceRequestsByUserId(
    userId: string,
    query: { status?: string; page?: number; limit?: number },
  ): Promise<
    StandardApiResponse<{
      requests: ServiceRequest[];
      total: number;
      totalPages: number;
    }>
  > {
    try {
      const { status, page = 1, limit = 10 } = query;

      const queryBuilder = this.serviceRequestRepository
        .createQueryBuilder('serviceRequest')
        .leftJoinAndSelect('serviceRequest.user', 'user')
        .leftJoinAndSelect('serviceRequest.service', 'service')
        .leftJoinAndSelect(
          'serviceRequest.professionalUser',
          'professionalUser',
        )
        .leftJoinAndSelect(
          'serviceRequest.serviceRequestSpecificationAmounts',
          'serviceRequestSpecificationAmounts',
        )
        .leftJoinAndSelect(
          'serviceRequestSpecificationAmounts.serviceSpecificationAmount',
          'serviceSpecificationAmount',
        )
        .leftJoinAndSelect('serviceRequest.userReview', 'userReview')
        .where('serviceRequest.user.id = :userId', { userId });

      if (
        status &&
        ['pending', 'in-progress', 'completed', 'cancelled'].includes(status)
      ) {
        queryBuilder.andWhere('serviceRequest.status = :status', { status });
      }

      const total = await queryBuilder.getCount();
      const requests = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return {
        isSuccess: true,
        data: {
          requests,
          total,
          totalPages: Math.ceil(total / limit),
        },
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to get service requests for user ID ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async getServiceRequests(query: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<
    StandardApiResponse<{
      requests: ServiceRequest[];
      total: number;
      totalPages: number;
    }>
  > {
    try {
      const { status, page = 1, limit = 10 } = query;

      const queryBuilder = this.serviceRequestRepository
        .createQueryBuilder('serviceRequest')
        .leftJoinAndSelect('serviceRequest.user', 'user')
        .leftJoinAndSelect('serviceRequest.service', 'service')
        .leftJoinAndSelect(
          'serviceRequest.professionalUser',
          'professionalUser',
        );

      if (
        status &&
        ['pending', 'in-progress', 'completed', 'cancelled'].includes(status)
      ) {
        queryBuilder.where('serviceRequest.status = :status', { status });
      }

      const total = await queryBuilder.getCount();
      const requests = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return {
        isSuccess: true,
        data: {
          requests,
          total,
          totalPages: Math.ceil(total / limit),
        },
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to get service requests by status`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async getPendingServiceRequestsWithoutProfessional(query: {
    page?: number;
    limit?: number;
  }): Promise<
    StandardApiResponse<{
      requests: ServiceRequest[];
      total: number;
      totalPages: number;
    }>
  > {
    try {
      const { page = 1, limit = 10 } = query;

      const queryBuilder = this.serviceRequestRepository
        .createQueryBuilder('serviceRequest')
        .leftJoinAndSelect('serviceRequest.user', 'user')
        .leftJoinAndSelect('serviceRequest.service', 'service')
        .leftJoinAndSelect(
          'serviceRequest.professionalUser',
          'professionalUser',
        )
        .where('serviceRequest.status = :status', { status: 'pending' })
        .andWhere('serviceRequest.professionalUser IS NULL');

      const total = await queryBuilder.getCount();
      const requests = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return {
        isSuccess: true,
        data: {
          requests,
          total,
          totalPages: Math.ceil(total / limit),
        },
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to get pending service requests without professional user`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async cancelServiceRequest(
    userId: string,
    requestId: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    try {
      const serviceRequest = await this.serviceRequestRepository.findOne({
        where: { id: requestId },
        relations: ['user'],
      });

      if (serviceRequest.user.id !== userId) {
        throw new ForbiddenException(
          `User ${userId} cannot cancel service request with ID ${requestId} because it is not theirs`,
        );
      }

      if (!serviceRequest) {
        throw new NotFoundException(
          `Service request with ID ${requestId} not found`,
        );
      }

      if (serviceRequest.status !== 'pending') {
        throw new BadRequestException(
          `Service request with ID ${requestId} cannot be cancelled because it is not in pending status`,
        );
      }

      const currentTime = new Date();
      const serviceDate = new Date(
        `${serviceRequest.date}T${serviceRequest.time}`,
      );
      const diffInHours =
        (serviceDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
      if (diffInHours <= 24) {
        throw new BadRequestException(
          `Service request with ID ${requestId} cannot be cancelled because it is too close to the scheduled time`,
        );
      }

      serviceRequest.status = 'cancelled';
      const updatedServiceRequest = await this.serviceRequestRepository.save(
        serviceRequest,
      );

      return {
        isSuccess: true,
        data: updatedServiceRequest,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to cancel service request with ID ${requestId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async rescheduleServiceRequest(
    userId: string,
    requestId: string,
    newDate: string,
    newTime: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    try {
      const serviceRequest = await this.serviceRequestRepository.findOne({
        where: { id: requestId },
        relations: ['professionalUser'],
      });

      if (!serviceRequest) {
        throw new NotFoundException(
          `Service request with ID ${requestId} not found`,
        );
      }

      if (serviceRequest.user.id !== userId) {
        throw new UnauthorizedException(
          `User with ID ${userId} is not authorized to reschedule this service request`,
        );
      }
      if (serviceRequest.status !== 'pending') {
        throw new BadRequestException(
          `Service request with ID ${requestId} cannot be rescheduled because it is not pending`,
        );
      }

      const currentTime = new Date();
      const serviceDate = new Date(
        `${serviceRequest.date}T${serviceRequest.time}`,
      );

      const diffInHours =
        (serviceDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

      if (diffInHours <= 24) {
        throw new BadRequestException(
          `Service request with ID ${requestId} cannot be rescheduled because it is too close to the scheduled time`,
        );
      }

      serviceRequest.date = newDate;
      serviceRequest.time = newTime;
      serviceRequest.professionalUser = null;

      const updatedServiceRequest = await this.serviceRequestRepository.save(
        serviceRequest,
      );

      return {
        isSuccess: true,
        data: updatedServiceRequest,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to reschedule service request with ID ${requestId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async assignProfessionalUserToServiceRequest(
    requestId: string,
    professionalUserId: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    try {
      const serviceRequest = await this.serviceRequestRepository.findOne({
        where: { id: requestId },
        relations: ['professionalUser'],
      });

      if (!serviceRequest) {
        throw new NotFoundException(
          `Service request with ID ${requestId} not found`,
        );
      }

      const user = await this.userRepository.findOne({
        where: { id: professionalUserId, role: 'user' },
        relations: ['professionalUser'],
      });

      if (!user || !user.professionalUser) {
        throw new NotFoundException(
          `Professional user with ID ${professionalUserId} not found or not authorized`,
        );
      }
      if (user.professionalUser.status !== 'approved') {
        throw new BadRequestException(
          `Professional user with ID ${professionalUserId} is not an approved professional`,
        );
      }

      serviceRequest.professionalUser = user;
      const updatedServiceRequest = await this.serviceRequestRepository.save(
        serviceRequest,
      );

      return {
        isSuccess: true,
        data: updatedServiceRequest,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to assign professional user with ID ${professionalUserId} to service request with ID ${requestId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async markServiceRequestInProgress(
    userId: string,
    requestId: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['professionalUser'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const serviceRequest = await this.serviceRequestRepository.findOne({
        where: { id: requestId },
        relations: ['professionalUser'],
      });
      if (!serviceRequest) {
        throw new NotFoundException(
          `Service request with ID ${requestId} not found`,
        );
      }

      if (serviceRequest.status !== 'pending') {
        throw new BadRequestException(
          `Service request with ID ${requestId} can only be marked as in-progress if it is in pending status`,
        );
      }

      if (user.role === 'user') {
        if (!user.professionalUser) {
          throw new UnauthorizedException(
            `User with ID ${userId} is not a professional user`,
          );
        }
        if (serviceRequest.professionalUser?.id !== userId) {
          throw new UnauthorizedException(
            `User with ID ${userId} is not assigned to this service request`,
          );
        }
      }

      serviceRequest.status = 'in-progress';
      const updatedServiceRequest = await this.serviceRequestRepository.save(
        serviceRequest,
      );

      return {
        isSuccess: true,
        data: updatedServiceRequest,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to mark service request with ID ${requestId} as in-progress`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async markServiceRequestCompleted(
    userId: string,
    requestId: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['professionalUser'],
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const serviceRequest = await this.serviceRequestRepository.findOne({
        where: { id: requestId },
        relations: ['professionalUser'],
      });
      if (!serviceRequest) {
        throw new NotFoundException(
          `Service request with ID ${requestId} not found`,
        );
      }

      if (serviceRequest.status !== 'in-progress') {
        throw new BadRequestException(
          `Service request with ID ${requestId} can only be marked as completed if it is in in-progress status`,
        );
      }

      if (user.role === 'user') {
        if (!user.professionalUser) {
          throw new UnauthorizedException(
            `User with ID ${userId} is not a professional user`,
          );
        }
        if (serviceRequest.professionalUser?.id !== userId) {
          throw new UnauthorizedException(
            `User with ID ${userId} is not assigned to this service request`,
          );
        }
      }

      serviceRequest.status = 'completed';
      const updatedServiceRequest = await this.serviceRequestRepository.save(
        serviceRequest,
      );

      return {
        isSuccess: true,
        data: updatedServiceRequest,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to mark service request with ID ${requestId} as completed`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async addReviewToServiceRequest(
    userId: string,
    requestId: string,
    dto: CreateReviewDto,
  ): Promise<StandardApiResponse<UserReview>> {
    try {
      const serviceRequest = await this.serviceRequestRepository.findOne({
        where: { id: requestId },
        relations: ['user', 'userReview'],
      });

      if (!serviceRequest) {
        throw new NotFoundException(
          `Service request with ID ${requestId} not found`,
        );
      }

      if (serviceRequest.user.id !== userId) {
        throw new UnauthorizedException(
          `User with ID ${userId} is not authorized to review this service request`,
        );
      }

      if (serviceRequest.userReview) {
        throw new BadRequestException(
          `Service request with ID ${requestId} has already been reviewed`,
        );
      }

      const review = this.userReviewRepository.create({
        user: serviceRequest.user,
        serviceRequest,
        comment: dto.comment,
        score: dto.score,
      });

      const savedReview = await this.userReviewRepository.save(review);

      serviceRequest.userReview = savedReview;
      await this.serviceRequestRepository.save(serviceRequest);

      return {
        isSuccess: true,
        data: savedReview,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to add review to service request with ID ${requestId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }
}
