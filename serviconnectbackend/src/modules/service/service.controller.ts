import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ServiceService } from './service.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ServiceDto,
  ServiceFAQDto,
  ServiceSpecificationAmountDto,
  ServiceTraitDto,
} from './dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Create a service' })
  async create(@Body() createServiceDto: ServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Update a service' })
  async update(@Param('id') id: string, @Body() updateServiceDto: ServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  async findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Delete a service' })
  async delete(@Param('id') id: string) {
    return this.serviceService.delete(id);
  }

  @Post(':serviceId/traits')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Add a trait to a service' })
  async addTrait(
    @Param('serviceId') serviceId: string,
    @Body() serviceTraitDto: ServiceTraitDto,
  ) {
    return this.serviceService.addTrait(serviceId, serviceTraitDto);
  }
  @Patch(':serviceId/traits/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Update a service trait' })
  async updateTrait(
    @Param('serviceId') serviceId: string,
    @Param('id') id: string,
    @Body() serviceTraitDto: ServiceTraitDto,
  ) {
    return this.serviceService.updateTrait(serviceId, id, serviceTraitDto);
  }
  @Delete(':serviceId/traits/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Delete a service trait' })
  async removeTrait(
    @Param('serviceId') serviceId: string,
    @Param('id') id: string,
  ) {
    return this.serviceService.removeTrait(serviceId, id);
  }

  @Post(':serviceId/specifications')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Add a specification to a service' })
  async addSpecification(
    @Param('serviceId') serviceId: string,
    @Body() serviceSpecificationAmountDto: ServiceSpecificationAmountDto,
  ) {
    return this.serviceService.addSpecification(
      serviceId,
      serviceSpecificationAmountDto,
    );
  }
  @Patch(':serviceId/specifications/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Update a service specification' })
  async updateSpecification(
    @Param('id') id: string,
    @Body() serviceSpecificationAmountDto: ServiceSpecificationAmountDto,
  ) {
    return this.serviceService.updateSpecification(
      id,
      serviceSpecificationAmountDto,
    );
  }
  @Delete(':serviceId/specifications/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Delete a service specification' })
  async removeSpecification(@Param('id') id: string) {
    return this.serviceService.removeSpecification(id);
  }

  @Post(':serviceId/faqs')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Add an FAQ to a service' })
  async addFAQ(
    @Param('serviceId') serviceId: string,
    @Body() serviceFAQDto: ServiceFAQDto,
  ) {
    return this.serviceService.addFAQ(serviceId, serviceFAQDto);
  }
  @Patch(':serviceId/faqs/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Update a service FAQ' })
  async updateFAQ(
    @Param('id') id: string,
    @Body() serviceFAQDto: ServiceFAQDto,
  ) {
    return this.serviceService.updateFAQ(id, serviceFAQDto);
  }
  @Delete(':serviceId/faqs/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Delete a service FAQ' })
  async removeFAQ(@Param('id') id: string) {
    return this.serviceService.removeFAQ(id);
  }
}
