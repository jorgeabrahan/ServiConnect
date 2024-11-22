import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Get,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserAddressDto } from './dto';
import { StandardApiResponse } from 'src/common/interfaces';
import { User, UserAddress } from 'src/core/domain/entities';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { SignupDto } from '../auth/dto';

@ApiTags('User UserAddress')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('create-admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Create a new admin' })
  async createAdmin(
    @Body() createAdminDto: SignupDto,
  ): Promise<StandardApiResponse<User>> {
    return this.userService.createAdmin(createAdminDto);
  }

  @Post('create-superadmin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Create a new superadmin' })
  async createSuperAdmin(
    @Body() createSuperAdminDto: SignupDto,
  ): Promise<StandardApiResponse<User>> {
    return this.userService.createSuperAdmin(createSuperAdminDto);
  }

  @Get(':id/address')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get an address of a user' })
  async getAddress(
    @Param('id') id: string,
  ): Promise<StandardApiResponse<UserAddress>> {
    return this.userService.getAddress(id);
  }

  @Post(':id/address')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add an address to a user' })
  async addAddress(
    @Param('id') id: string,
    @Body() address: UserAddressDto,
  ): Promise<StandardApiResponse<UserAddress>> {
    return this.userService.addAddress(id, address);
  }

  @Patch(':userId/address/:addressId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an address for a user' })
  async updateAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
    @Body() address: UserAddressDto,
  ): Promise<StandardApiResponse<UserAddress>> {
    return this.userService.updateAddress(userId, addressId, address);
  }
}
