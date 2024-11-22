import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CountryDepartmentCity,
  ProfessionalUser,
  ProfessionalUserSchedule,
  ProfessionalUserService,
  ProfessionalUserServiceArea,
  User,
} from 'src/core/domain/entities';
import { StandardApiResponse } from 'src/common/interfaces';
import {
  ProfessionalUserScheduleDto,
  ProfessionalUserServiceAreaDto,
  ProfessionalUserServiceDto,
} from './dto';

@Injectable()
export class ProfessionalService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ProfessionalUser)
    private readonly professionalUserRepository: Repository<ProfessionalUser>,
    @InjectRepository(ProfessionalUserService)
    private readonly professionalUserServiceRepository: Repository<ProfessionalUserService>,
    @InjectRepository(ProfessionalUserServiceArea)
    private readonly professionalUserServiceAreaRepository: Repository<ProfessionalUserServiceArea>,
    @InjectRepository(CountryDepartmentCity)
    private readonly countryDepartmentCityRepository: Repository<CountryDepartmentCity>,
    @InjectRepository(ProfessionalUserSchedule)
    private readonly professionalUserScheduleRepository: Repository<ProfessionalUserSchedule>,
  ) {}

  private readonly daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  async createProfessionalUser(
    userId: string,
  ): Promise<StandardApiResponse<ProfessionalUser>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, role: 'user' },
        relations: ['professionalUser'],
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${userId} not found or not authorized`,
        );
      }

      if (user.professionalUser) {
        return {
          isSuccess: true,
          data: user.professionalUser,
          error: null,
        };
      }

      const professionalUser = this.professionalUserRepository.create({
        user,
        status: 'idle',
      });
      return {
        isSuccess: true,
        data: await this.professionalUserRepository.save(professionalUser),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed creating professional user';
      return {
        isSuccess: false,
        data: null,
        error: error.message ?? fallbackErrorMessage,
      };
    }
  }

  async getProfessionalUser(
    userId: string,
  ): Promise<StandardApiResponse<ProfessionalUser>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, role: 'user' },
        relations: ['professionalUser'],
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${userId} not found or not authorized`,
        );
      }

      if (!user.professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found`,
        );
      }

      return {
        isSuccess: true,
        data: await this.professionalUserRepository.findOne({
          where: { id: user.professionalUser.id },
          relations: [
            'professionalUserServices',
            'professionalUserServices.service',
            'professionalUserServiceAreas',
            'professionalUserServiceAreas.countryDepartmentCity',
            'professionalUserServiceAreas.countryDepartmentCity.countryDepartment',
            'professionalUserSchedules',
          ],
        }),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to get professional user with id ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async addProfessionalUserService(
    userId: string,
    dto: ProfessionalUserServiceDto,
  ): Promise<StandardApiResponse<ProfessionalUserService>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, role: 'user' },
        relations: [
          'professionalUser',
          'professionalUser.professionalUserServices',
        ],
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${userId} not found or not authorized`,
        );
      }

      if (!user.professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found`,
        );
      }
      if (user.professionalUser.status === 'approved') {
        throw new BadRequestException(
          `You cannot add a service to your professional profile once it has been approved. If you want to change the services you provide`,
        );
      }
      const existingService =
        user.professionalUser.professionalUserServices.find(
          (service) => service.id === dto.serviceId,
        );
      if (existingService) {
        throw new BadRequestException(
          `Service with ID ${dto.serviceId} is already associated with this professional user`,
        );
      }

      const professionalUserService =
        this.professionalUserServiceRepository.create({
          professionalUser: user.professionalUser,
          service: { id: dto.serviceId },
          yearsOfExperience: dto.yearsOfExperience,
          description: dto.description,
        });

      return {
        isSuccess: true,
        data: await this.professionalUserServiceRepository.save(
          professionalUserService,
        ),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to add professional user service with id ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async deleteProfessionalUserService(
    userId: string,
    professionalUserServiceId: string,
  ): Promise<StandardApiResponse<ProfessionalUserService>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, role: 'user' },
        relations: ['professionalUser'],
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${userId} not found or not authorized`,
        );
      }

      if (!user.professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found`,
        );
      }

      const professionalUserService =
        await this.professionalUserServiceRepository.findOne({
          where: {
            id: professionalUserServiceId,
            professionalUser: { id: user.professionalUser.id },
          },
        });

      if (!professionalUserService) {
        throw new NotFoundException(
          `Service with ID ${professionalUserServiceId} not found for the professional user`,
        );
      }

      await this.professionalUserServiceRepository.remove(
        professionalUserService,
      );
      return {
        isSuccess: true,
        data: professionalUserService,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to delete professional user service with id ${professionalUserServiceId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async updateProfessionalUserService(
    userId: string,
    professionalUserServiceId: string,
    dto: ProfessionalUserServiceDto,
  ): Promise<StandardApiResponse<ProfessionalUserService>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, role: 'user' },
        relations: ['professionalUser'],
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${userId} not found or not authorized`,
        );
      }

      if (!user.professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found`,
        );
      }

      let professionalUserService =
        await this.professionalUserServiceRepository.findOne({
          where: {
            id: professionalUserServiceId,
            professionalUser: { id: user.professionalUser.id },
          },
        });

      if (!professionalUserService) {
        throw new NotFoundException(
          `Service with ID ${professionalUserServiceId} not found for the professional user`,
        );
      }

      professionalUserService = this.professionalUserServiceRepository.merge(
        professionalUserService,
        {
          service: { id: dto.serviceId },
          yearsOfExperience: dto.yearsOfExperience,
          description: dto.description,
        },
      );

      return {
        isSuccess: true,
        data: await this.professionalUserServiceRepository.save(
          professionalUserService,
        ),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to update professional user service with id ${professionalUserServiceId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async addProfessionalUserServiceArea(
    userId: string,
    dto: ProfessionalUserServiceAreaDto,
  ): Promise<StandardApiResponse<ProfessionalUserServiceArea>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, role: 'user' },
        relations: ['professionalUser'],
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${userId} not found or not authorized`,
        );
      }
      if (!user.professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found`,
        );
      }
      const countryDepartmentCity =
        await this.countryDepartmentCityRepository.findOne({
          where: { id: dto.countryDepartmentCityId },
        });
      if (!countryDepartmentCity) {
        throw new NotFoundException(
          `CountryDepartmentCity with ID ${dto.countryDepartmentCityId} not found`,
        );
      }
      const professionalUserServiceArea =
        this.professionalUserServiceAreaRepository.create({
          professionalUser: user.professionalUser,
          countryDepartmentCity: countryDepartmentCity,
        });
      return {
        isSuccess: true,
        data: await this.professionalUserServiceAreaRepository.save(
          professionalUserServiceArea,
        ),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to add professional user service area with id ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async deleteProfessionalUserServiceArea(
    userId: string,
    professionalUserServiceAreaId: string,
  ): Promise<StandardApiResponse<null>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, role: 'user' },
        relations: ['professionalUser'],
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${userId} not found or not authorized`,
        );
      }
      if (!user.professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found`,
        );
      }
      const professionalUserServiceArea =
        await this.professionalUserServiceAreaRepository.findOne({
          where: {
            id: professionalUserServiceAreaId,
            professionalUser: { id: user.professionalUser.id },
          },
        });
      if (!professionalUserServiceArea) {
        throw new NotFoundException(
          `Service area with ID ${professionalUserServiceAreaId} not found for the professional user`,
        );
      }
      await this.professionalUserServiceAreaRepository.remove(
        professionalUserServiceArea,
      );
      return { isSuccess: true, data: null, error: null };
    } catch (error) {
      const fallbackErrorMessage = `Failed to delete professional user service area with id ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async createProfessionalUserSchedules(
    userId: string,
    schedules: ProfessionalUserScheduleDto[],
  ): Promise<StandardApiResponse<ProfessionalUserSchedule[]>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, role: 'user' },
        relations: ['professionalUser'],
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${userId} not found or not authorized`,
        );
      }
      if (!user.professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found`,
        );
      }
      if (user.professionalUser.professionalUserSchedules.length > 0) {
        throw new BadRequestException(
          `You already have schedules set for your professional profile, edit them instead.`,
        );
      }
      if (schedules.length !== 7) {
        throw new BadRequestException(
          'Schedules must contain 7 elements, one for each day of the week.',
        );
      }
      const uniqueDays = new Set<string>();
      for (const schedule of schedules) {
        if (!this.daysOfWeek.includes(schedule.day)) {
          throw new BadRequestException(`Invalid day: ${schedule.day}.`);
        }
        if (uniqueDays.has(schedule.day)) {
          throw new BadRequestException(
            `Duplicate day found: ${schedule.day}. Each day of the week must be unique.`,
          );
        }
        uniqueDays.add(schedule.day);
        if (schedule.isAvailable === undefined) {
          schedule.isAvailable = true;
        }
        if (
          schedule.isAvailable &&
          (!schedule.startTime || !schedule.endTime)
        ) {
          throw new BadRequestException(
            `Start time and end time must be provided for available day: ${schedule.day}.`,
          );
        }
        if (!schedule.isAvailable) {
          schedule.startTime = null;
          schedule.endTime = null;
        }
      }
      if (uniqueDays.size !== this.daysOfWeek.length) {
        throw new BadRequestException(
          'Schedules must contain exactly one entry for each day of the week.',
        );
      }
      const professionalUserSchedules = schedules.map((schedule) => {
        return this.professionalUserScheduleRepository.create({
          professionalUser: user.professionalUser,
          day: schedule.day,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isAvailable: schedule.isAvailable,
        });
      });
      return {
        isSuccess: true,
        data: await this.professionalUserScheduleRepository.save(
          professionalUserSchedules,
        ),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to create professional user schedules for user ID ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async updateProfessionalUserSchedules(
    userId: string,
    schedules: ProfessionalUserScheduleDto[],
  ): Promise<StandardApiResponse<ProfessionalUserSchedule[]>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, role: 'user' },
        relations: ['professionalUser'],
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${userId} not found or not authorized`,
        );
      }

      if (!user.professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found`,
        );
      }

      const uniqueDays = new Set<string>();

      for (const schedule of schedules) {
        if (!this.daysOfWeek.includes(schedule.day)) {
          throw new BadRequestException(`Invalid day: ${schedule.day}.`);
        }

        if (uniqueDays.has(schedule.day)) {
          throw new BadRequestException(
            `Duplicate day found: ${schedule.day}. Each day of the week must be unique.`,
          );
        }

        uniqueDays.add(schedule.day);

        if (schedule.isAvailable === undefined) {
          schedule.isAvailable = true;
        }

        if (
          schedule.isAvailable &&
          (!schedule.startTime || !schedule.endTime)
        ) {
          throw new BadRequestException(
            `Start time and end time must be provided for available day: ${schedule.day}.`,
          );
        }

        if (!schedule.isAvailable) {
          schedule.startTime = null;
          schedule.endTime = null;
        }
      }

      const existingSchedules =
        await this.professionalUserScheduleRepository.find({
          where: { professionalUser: { id: user.professionalUser.id } },
        });

      for (const schedule of schedules) {
        const existingSchedule = existingSchedules.find(
          (es) => es.day === schedule.day,
        );
        if (existingSchedule) {
          existingSchedule.startTime = schedule.isAvailable
            ? schedule.startTime
            : null;
          existingSchedule.endTime = schedule.isAvailable
            ? schedule.endTime
            : null;
          existingSchedule.isAvailable = schedule.isAvailable;
        }
      }

      return {
        isSuccess: true,
        data: await this.professionalUserScheduleRepository.save(
          existingSchedules,
        ),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to update professional user schedules for user ID ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async applyToBecomeProfessional(
    userId: string,
  ): Promise<StandardApiResponse<ProfessionalUser>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, role: 'user' },
        relations: [
          'professionalUser',
          'professionalUser.professionalUserServices',
          'professionalUser.professionalUserServiceAreas',
          'professionalUser.professionalUserSchedules',
        ],
      });

      if (!user) {
        throw new NotFoundException(
          `User with ID ${userId} not found or not authorized`,
        );
      }

      if (!user.professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found`,
        );
      }

      if (user.professionalUser.status !== 'idle') {
        throw new BadRequestException(
          `You cannot apply to become a professional if your current status is ${user.professionalUser.status}.`,
        );
      }

      const professionalUser = user.professionalUser;

      if (professionalUser.professionalUserServices.length === 0) {
        throw new BadRequestException(
          'You must add at least one service to your professional profile.',
        );
      }

      if (professionalUser.professionalUserServiceAreas.length === 0) {
        throw new BadRequestException(
          'You must add at least one service area to your professional profile.',
        );
      }

      if (professionalUser.professionalUserSchedules.length !== 7) {
        throw new BadRequestException(
          'You must set your availability for all 7 days of the week.',
        );
      }

      professionalUser.status = 'pending';
      const updatedProfessionalUser =
        await this.professionalUserRepository.save(professionalUser);

      const fullProfessionalUser =
        await this.professionalUserRepository.findOne({
          where: { id: updatedProfessionalUser.id },
          relations: [
            'professionalUserServices',
            'professionalUserServiceAreas',
            'professionalUserSchedules',
          ],
        });

      return {
        isSuccess: true,
        data: fullProfessionalUser,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to apply to become professional for user ID ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async approveProfessionalUser(
    userId: string,
  ): Promise<StandardApiResponse<ProfessionalUser>> {
    try {
      const professionalUser = await this.professionalUserRepository.findOne({
        where: { user: { id: userId }, status: 'pending' },
      });

      if (!professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found or not in a pending state`,
        );
      }

      professionalUser.status = 'approved';
      const updatedProfessionalUser =
        await this.professionalUserRepository.save(professionalUser);

      return {
        isSuccess: true,
        data: updatedProfessionalUser,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to approve professional user with ID ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async denyProfessionalUser(
    userId: string,
  ): Promise<StandardApiResponse<ProfessionalUser>> {
    try {
      const professionalUser = await this.professionalUserRepository.findOne({
        where: { user: { id: userId }, status: 'pending' },
      });

      if (!professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found or not in a pending state`,
        );
      }

      professionalUser.status = 'denied';
      const updatedProfessionalUser =
        await this.professionalUserRepository.save(professionalUser);

      return {
        isSuccess: true,
        data: updatedProfessionalUser,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to deny professional user with ID ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async deactivateProfessionalUser(
    userId: string,
  ): Promise<StandardApiResponse<ProfessionalUser>> {
    try {
      const professionalUser = await this.professionalUserRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!professionalUser) {
        throw new NotFoundException(
          `Professional user for user ID ${userId} not found`,
        );
      }

      if (professionalUser.status === 'idle') {
        throw new BadRequestException(
          `Professional user for user ID ${userId} is already in idle state`,
        );
      }

      professionalUser.status = 'idle';
      const updatedProfessionalUser =
        await this.professionalUserRepository.save(professionalUser);

      return {
        isSuccess: true,
        data: updatedProfessionalUser,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to deactivate professional user with ID ${userId}`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async getProfessionalUsers(query: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<
    StandardApiResponse<{
      users: ProfessionalUser[];
      total: number;
      totalPages: number;
    }>
  > {
    try {
      const { status, page = 1, limit = 10 } = query;

      const queryBuilder = this.professionalUserRepository
        .createQueryBuilder('professionalUser')
        .leftJoinAndSelect('professionalUser.user', 'user');

      if (
        status &&
        ['idle', 'pending', 'approved', 'denied'].includes(status)
      ) {
        queryBuilder.where('professionalUser.status = :status', { status });
      }

      const total = await queryBuilder.getCount();
      const users = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return {
        isSuccess: true,
        data: {
          users,
          total,
          totalPages: Math.ceil(total / limit),
        },
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = `Failed to get professional users`;
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }
}
