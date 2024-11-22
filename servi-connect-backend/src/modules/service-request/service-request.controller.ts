import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ServiceRequestService } from './service-request.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { StandardApiResponse } from 'src/common/interfaces';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { ServiceRequest, UserReview } from 'src/core/domain/entities';
import { CreateReviewDto, RescheduleServiceRequestDto } from './dto';

@ApiTags('ServiceRequests')
@Controller('service-requests')
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}

  @Post('user/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Create a new service request' })
  async createServiceRequest(
    @Param('userId') userId: string,
    @Body() dto: CreateServiceRequestDto,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    return this.serviceRequestService.createServiceRequest(userId, dto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Get service request by ID' })
  async getServiceRequestById(
    @Param('id') requestId: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    return this.serviceRequestService.getServiceRequestById(requestId);
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Get all service requests made by a user' })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getServiceRequestsByUserId(
    @Param('userId') userId: string,
    @Query() query: { status?: string; page?: number; limit?: number },
  ): Promise<
    StandardApiResponse<{
      requests: ServiceRequest[];
      total: number;
      totalPages: number;
    }>
  > {
    return this.serviceRequestService.getServiceRequestsByUserId(userId, query);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Get service requests filtered by status' })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getServiceRequestsByStatus(
    @Query() query: { status?: string; page?: number; limit?: number },
  ): Promise<
    StandardApiResponse<{
      requests: ServiceRequest[];
      total: number;
      totalPages: number;
    }>
  > {
    return this.serviceRequestService.getServiceRequests(query);
  }

  @Get('pending-without-professional')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @ApiOperation({
    summary: 'Get pending service requests without professional user assigned',
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
  async getPendingServiceRequestsWithoutProfessional(
    @Query() query: { page?: number; limit?: number },
  ): Promise<
    StandardApiResponse<{
      requests: ServiceRequest[];
      total: number;
      totalPages: number;
    }>
  > {
    return this.serviceRequestService.getPendingServiceRequestsWithoutProfessional(
      query,
    );
  }

  @Patch('user/:userId/reschedule/:requestId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Reschedule a service request' })
  async rescheduleServiceRequest(
    @Param('userId') userId: string,
    @Param('requestId') requestId: string,
    @Body() dto: RescheduleServiceRequestDto,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    return this.serviceRequestService.rescheduleServiceRequest(
      userId,
      requestId,
      dto.date,
      dto.time,
    );
  }

  @Patch('user/:userId/cancel/:requestId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Cancel a service request' })
  async cancelServiceRequest(
    @Param('userId') userId: string,
    @Param('requestId') requestId: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    return this.serviceRequestService.cancelServiceRequest(userId, requestId);
  }

  @Post('user/:userId/review/:requestId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Add a review to a service request' })
  async addReviewToServiceRequest(
    @Param('userId') userId: string,
    @Param('requestId') requestId: string,
    @Body() dto: CreateReviewDto,
  ): Promise<StandardApiResponse<UserReview>> {
    return this.serviceRequestService.addReviewToServiceRequest(
      userId,
      requestId,
      dto,
    );
  }

  @Patch(':requestId/assign-professional/:professionalUserId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @ApiOperation({ summary: 'Assign a professional user to a service request' })
  async assignProfessionalUserToServiceRequest(
    @Param('requestId') requestId: string,
    @Param('professionalUserId') professionalUserId: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    return this.serviceRequestService.assignProfessionalUserToServiceRequest(
      requestId,
      professionalUserId,
    );
  }

  @Patch('user/:userId/in-progress/:requestId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @ApiOperation({ summary: 'Mark a service request as in-progress' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    required: true,
    description:
      'The ID of the user that is marking the service request as in progress, if it is a professional user it must be the same as the one assigned to the service request, otherwise if it is an admin it can be any user',
  })
  async markServiceRequestInProgress(
    @Param('userId') userId: string,
    @Param('requestId') requestId: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    return this.serviceRequestService.markServiceRequestInProgress(
      userId,
      requestId,
    );
  }

  @Patch('user/:userId/completed/:requestId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @ApiOperation({
    summary: 'Mark a service request as completed',
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    required: true,
    description:
      'The ID of the user that is marking the service request as completed, if it is a professional user it must be the same as the one assigned to the service request, otherwise if it is an admin it can be any user',
  })
  async markServiceRequestCompleted(
    @Param('userId') userId: string,
    @Param('requestId') requestId: string,
  ): Promise<StandardApiResponse<ServiceRequest>> {
    return this.serviceRequestService.markServiceRequestCompleted(
      userId,
      requestId,
    );
  }
}
