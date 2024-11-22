import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProfessionalUserServiceDto } from './dto/professional-user-service.dto';
import { ProfessionalUserServiceAreaDto } from './dto/professional-user-service-area.dto';
import { ProfessionalUserScheduleDto } from './dto/professional-user-schedule.dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { ProfessionalService } from './professional-user.service';
import { Roles } from '../auth/decorators/roles.decorator';

const schedulesSwaggerSchema = {
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        day: {
          type: 'string',
          enum: [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
          ],
          example: 'monday',
        },
        startTime: { type: 'string', example: '08:00' },
        endTime: { type: 'string', example: '17:00' },
        isAvailable: { type: 'boolean', example: true },
      },
    },
    example: [
      {
        day: 'monday',
        startTime: '08:00',
        endTime: '17:00',
        isAvailable: true,
      },
      {
        day: 'tuesday',
        startTime: '08:00',
        endTime: '17:00',
        isAvailable: true,
      },
      {
        day: 'wednesday',
        startTime: '08:00',
        endTime: '17:00',
        isAvailable: true,
      },
      {
        day: 'thursday',
        startTime: '08:00',
        endTime: '17:00',
        isAvailable: true,
      },
      {
        day: 'friday',
        startTime: '08:00',
        endTime: '17:00',
        isAvailable: true,
      },
      {
        day: 'saturday',
        startTime: '08:00',
        endTime: '17:00',
        isAvailable: true,
      },
      {
        day: 'sunday',
        startTime: '08:00',
        endTime: '17:00',
        isAvailable: true,
      },
    ],
  },
};

@ApiTags('ProfessionalUser')
@Controller('professional-users')
export class ProfessionalUserController {
  constructor(private readonly professionalUserService: ProfessionalService) {}

  @Post(':userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Create professional user' })
  async createProfessionalUser(@Param('userId') userId: string) {
    return this.professionalUserService.createProfessionalUser(userId);
  }

  @Get(':userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Get professional user' })
  async getProfessionalUser(@Param('userId') userId: string) {
    return this.professionalUserService.getProfessionalUser(userId);
  }

  @Post(':userId/services')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Add a service to a professional user' })
  async addProfessionalUserService(
    @Param('userId') userId: string,
    @Body() dto: ProfessionalUserServiceDto,
  ) {
    return this.professionalUserService.addProfessionalUserService(userId, dto);
  }

  @Patch(':userId/services/:serviceId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Update a service for a professional user' })
  async updateProfessionalUserService(
    @Param('userId') userId: string,
    @Param('serviceId') serviceId: string,
    @Body() dto: ProfessionalUserServiceDto,
  ) {
    return this.professionalUserService.updateProfessionalUserService(
      userId,
      serviceId,
      dto,
    );
  }

  @Delete(':userId/services/:serviceId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Delete a service from a professional user' })
  async deleteProfessionalUserService(
    @Param('userId') userId: string,
    @Param('serviceId') serviceId: string,
  ) {
    return this.professionalUserService.deleteProfessionalUserService(
      userId,
      serviceId,
    );
  }

  @Post(':userId/service-areas')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Add a service area to a professional user' })
  async addProfessionalUserServiceArea(
    @Param('userId') userId: string,
    @Body() dto: ProfessionalUserServiceAreaDto,
  ) {
    return this.professionalUserService.addProfessionalUserServiceArea(
      userId,
      dto,
    );
  }

  @Delete(':userId/service-areas/:serviceAreaId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Delete a service area from a professional user' })
  async deleteProfessionalUserServiceArea(
    @Param('userId') userId: string,
    @Param('serviceAreaId') serviceAreaId: string,
  ) {
    return this.professionalUserService.deleteProfessionalUserServiceArea(
      userId,
      serviceAreaId,
    );
  }

  @Post(':userId/schedules')
  @ApiBody(schedulesSwaggerSchema)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Create schedules for a professional user' })
  async createProfessionalUserSchedules(
    @Param('userId') userId: string,
    @Body() schedules: ProfessionalUserScheduleDto[],
  ) {
    return this.professionalUserService.createProfessionalUserSchedules(
      userId,
      schedules,
    );
  }

  @Patch(':userId/schedules')
  @ApiBody(schedulesSwaggerSchema)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Update schedules for a professional user' })
  async updateProfessionalUserSchedules(
    @Param('userId') userId: string,
    @Body() schedules: ProfessionalUserScheduleDto[],
  ) {
    return this.professionalUserService.updateProfessionalUserSchedules(
      userId,
      schedules,
    );
  }

  @Post(':userId/apply')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({
    summary:
      'Apply to become a professional once the professional profile is completed',
  })
  async applyToBecomeProfessional(@Param('userId') userId: string) {
    return this.professionalUserService.applyToBecomeProfessional(userId);
  }

  @Post(':userId/approve')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Approve a professional user' })
  async approveProfessionalUser(@Param('userId') userId: string) {
    return this.professionalUserService.approveProfessionalUser(userId);
  }

  @Post(':userId/deny')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Deny a professional user' })
  async denyProfessionalUser(@Param('userId') userId: string) {
    return this.professionalUserService.denyProfessionalUser(userId);
  }

  @Patch(':userId/deactivate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Deactivate a professional user' })
  async deactivateProfessionalUser(@Param('userId') userId: string) {
    return this.professionalUserService.deactivateProfessionalUser(userId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({
    summary: 'Get professional users with pagination and status filter',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by status',
    enum: ['idle', 'pending', 'approved', 'denied'],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of results per page',
    example: 10,
  })
  async getProfessionalUsers(
    @Query() query: { status?: string; page?: number; limit?: number },
  ) {
    return this.professionalUserService.getProfessionalUsers(query);
  }
}
