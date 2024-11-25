import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CountryDepartmentService } from './country-department.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateCountryDepartmentCityDto,
  CreateCountryDepartmentDto,
} from './dto';
import {
  CountryDepartment,
  CountryDepartmentCity,
} from 'src/core/domain/entities';
import { StandardApiResponse } from 'src/common/interfaces';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('CountryDepartment CountryDepartmentCity')
@Controller('departments')
export class CountryDepartmentController {
  constructor(private readonly departmentService: CountryDepartmentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Create a country department' })
  async create(
    @Body() department: CreateCountryDepartmentDto,
  ): Promise<StandardApiResponse<CountryDepartment>> {
    return this.departmentService.create(department as CountryDepartment);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Update a country department' })
  async update(
    @Param('id') id: string,
    @Body() department: CreateCountryDepartmentDto,
  ): Promise<StandardApiResponse<CountryDepartment>> {
    return this.departmentService.update(
      id,
      department as CreateCountryDepartmentDto,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete a country department' })
  async delete(
    @Param('id') id: string,
  ): Promise<StandardApiResponse<CountryDepartment>> {
    return this.departmentService.delete(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a country department by ID' })
  async findOne(
    @Param('id') id: string,
  ): Promise<StandardApiResponse<CountryDepartment>> {
    return this.departmentService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all country departments' })
  async findAll(): Promise<StandardApiResponse<CountryDepartment[]>> {
    return this.departmentService.findAll();
  }

  @Post(':id/cities')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Add a city to a country department' })
  async addCity(
    @Param('id') id: string,
    @Body() city: CreateCountryDepartmentCityDto,
  ): Promise<StandardApiResponse<CountryDepartmentCity>> {
    return this.departmentService.addCity(id, city as CountryDepartmentCity);
  }

  @Delete('cities/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Delete a city' })
  async deleteCity(
    @Param('id') id: string,
  ): Promise<StandardApiResponse<CountryDepartmentCity>> {
    return this.departmentService.deleteCity(id);
  }
}
