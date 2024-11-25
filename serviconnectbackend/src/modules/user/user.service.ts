import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserAddress } from 'src/core/domain/entities';
import { StandardApiResponse } from 'src/common/interfaces';
import { UserAddressDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private readonly addressRepository: Repository<UserAddress>,
  ) {}

  async createUser(user: Partial<User>): Promise<StandardApiResponse<User>> {
    try {
      const passwordHash = await bcrypt.hash(user.password, 10);
      user.password = passwordHash;
      user.role = 'user';
      const newUser = await this.userRepository.save(user as User);
      return {
        isSuccess: true,
        data: newUser,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to create user';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async createAdmin(user: Partial<User>): Promise<StandardApiResponse<User>> {
    try {
      const passwordHash = await bcrypt.hash(user.password, 10);
      user.password = passwordHash;
      user.role = 'admin';
      const newUser = await this.userRepository.save(user as User);
      return {
        isSuccess: true,
        data: newUser,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to create admin';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async createSuperAdmin(
    user: Partial<User>,
  ): Promise<StandardApiResponse<User>> {
    try {
      const passwordHash = await bcrypt.hash(user.password, 10);
      user.password = passwordHash;
      user.role = 'superadmin';
      const newUser = await this.userRepository.save(user as User);
      return {
        isSuccess: true,
        data: newUser,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to create superadmin';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({
        where: { email },
        relations: ['professionalUser'],
      });
    } catch (error) {
      throw new Error(error?.message ?? 'Failed to find user by email');
    }
  }

  async findById(id: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({
        where: { id },
        relations: ['professionalUser'],
      });
    } catch (error) {
      throw new Error(error?.message ?? 'Failed to find user by id');
    }
  }

  async getAddress(userId: string): Promise<StandardApiResponse<UserAddress>> {
    try {
      const userAddress = await this.addressRepository.findOne({
        where: { user: { id: userId } },
        relations: [
          'countryDepartmentCity',
          'countryDepartmentCity.countryDepartment',
        ],
      });
      if (!userAddress) {
        return {
          isSuccess: false,
          data: null,
          error: 'User address not found',
        };
      }
      return { isSuccess: true, data: userAddress, error: null };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      const fallbackErrorMessage = 'Failed to get user address';
      return { isSuccess: false, data: null, error: fallbackErrorMessage };
    }
  }

  async addAddress(
    userId: string,
    address: UserAddressDto,
  ): Promise<StandardApiResponse<UserAddress>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['address'],
      });
      if (!user) {
        return { isSuccess: false, data: null, error: 'User not found' };
      }
      const existingAddress = await this.addressRepository.findOne({
        where: { user: { id: userId } },
      });
      if (existingAddress) {
        return {
          isSuccess: false,
          data: null,
          error: 'User already has address',
        };
      }
      const newAddress = this.addressRepository.create({ ...address, user });
      await this.addressRepository.save(newAddress);
      const fullAddress = await this.addressRepository.findOne({
        where: { id: newAddress.id },
        relations: [
          'countryDepartmentCity',
          'countryDepartmentCity.countryDepartment',
        ],
      });
      return { isSuccess: true, data: fullAddress, error: null };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to add address';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async updateAddress(
    userId: string,
    addressId: string,
    address: UserAddressDto,
  ): Promise<StandardApiResponse<UserAddress>> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['address'],
      });
      if (!user) {
        return { isSuccess: false, data: null, error: 'User not found' };
      }
      const existingAddress = await this.addressRepository.findOne({
        where: { id: addressId, user: { id: userId } },
      });
      if (!existingAddress) {
        return { isSuccess: false, data: null, error: 'Address not found' };
      }
      const updatedAddress = this.addressRepository.merge(
        existingAddress,
        address,
      );
      await this.addressRepository.save(updatedAddress);
      const fullAddress = await this.addressRepository.findOne({
        where: { id: updatedAddress.id },
        relations: [
          'countryDepartmentCity',
          'countryDepartmentCity.countryDepartment',
        ],
      });
      return { isSuccess: true, data: fullAddress, error: null };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to update address';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }
}
