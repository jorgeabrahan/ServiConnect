import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StandardApiResponse } from 'src/common/interfaces';
import {
  CountryDepartment,
  CountryDepartmentCity,
} from 'src/core/domain/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CountryDepartmentService {
  constructor(
    @InjectRepository(CountryDepartment)
    private readonly departmentRepository: Repository<CountryDepartment>,
    @InjectRepository(CountryDepartmentCity)
    private readonly cityRepository: Repository<CountryDepartmentCity>,
  ) {}

  async create(
    department: CountryDepartment,
  ): Promise<StandardApiResponse<CountryDepartment>> {
    try {
      const createdDepartment = await this.departmentRepository.save(
        department,
      );
      return {
        isSuccess: true,
        data: createdDepartment,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to create department';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async update(
    id: string,
    department: Partial<CountryDepartment>,
  ): Promise<StandardApiResponse<CountryDepartment>> {
    try {
      const result = await this.departmentRepository.update(id, department);
      if (result.affected === 0) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }
      const updatedDepartment = await this.departmentRepository.findOneBy({
        id,
      });
      return {
        isSuccess: true,
        data: updatedDepartment,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to update department';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async delete(id: string): Promise<StandardApiResponse<CountryDepartment>> {
    try {
      const departmentToDelete = await this.departmentRepository.findOneBy({
        id,
      });
      const result = await this.departmentRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }
      return { isSuccess: true, data: departmentToDelete, error: null };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to delete department';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async findOne(id: string): Promise<StandardApiResponse<CountryDepartment>> {
    try {
      const department = await this.departmentRepository.findOneOrFail({
        where: { id },
        relations: ['cities'],
      });
      return {
        isSuccess: true,
        data: department,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to find department';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async findAll(): Promise<StandardApiResponse<CountryDepartment[]>> {
    try {
      const departments = await this.departmentRepository.find({
        relations: ['cities'],
      });
      return { isSuccess: true, data: departments, error: null };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to find all departments';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async addCity(
    departmentId: string,
    city: CountryDepartmentCity,
  ): Promise<StandardApiResponse<CountryDepartmentCity>> {
    try {
      const department = await this.departmentRepository.findOneBy({
        id: departmentId,
      });
      if (!department) {
        throw new NotFoundException(
          `Department with ID ${departmentId} not found`,
        );
      }
      city.countryDepartment = department;
      const createdCity = await this.cityRepository.save(city);
      return {
        isSuccess: true,
        data: createdCity,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to create city';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async deleteCity(
    cityId: string,
  ): Promise<StandardApiResponse<CountryDepartmentCity>> {
    try {
      const cityToDelete = await this.cityRepository.findOneBy({ id: cityId });
      const result = await this.cityRepository.delete(cityId);
      if (result.affected === 0) {
        throw new NotFoundException(`City with ID ${cityId} not found`);
      }
      return {
        isSuccess: true,
        data: cityToDelete,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to delete city';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }
}
