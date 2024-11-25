import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Category } from 'src/core/domain/entities';
import { CategoryDto } from './dto';
import { StandardApiResponse } from 'src/common/interfaces';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CategoryDto,
  ): Promise<StandardApiResponse<Category>> {
    try {
      const existingCategoryWithSameName =
        await this.categoryRepository.findOne({
          where: { title: createCategoryDto.title },
        });

      if (existingCategoryWithSameName) {
        return {
          isSuccess: false,
          data: null,
          error: 'A category with the same title already exists',
        };
      }

      const category = this.categoryRepository.create(createCategoryDto);
      return {
        isSuccess: true,
        data: await this.categoryRepository.save(category),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to create category';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async update(
    id: string,
    updateCategoryDto: CategoryDto,
  ): Promise<StandardApiResponse<Category>> {
    try {
      if (updateCategoryDto.title) {
        const existingCategoryWithSameName =
          await this.categoryRepository.findOne({
            where: { title: updateCategoryDto.title, id: Not(id) },
          });

        if (existingCategoryWithSameName) {
          return {
            isSuccess: false,
            data: null,
            error: 'A category with the same title already exists',
          };
        }
      }

      const category = await this.categoryRepository.preload({
        id,
        ...updateCategoryDto,
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return {
        isSuccess: true,
        data: await this.categoryRepository.save(category),
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to update category';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async findAll(): Promise<StandardApiResponse<Category[]>> {
    try {
      const categories = await this.categoryRepository.find({
        relations: ['services'],
      });
      return {
        isSuccess: true,
        data: categories,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to get categories';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async findOne(id: string): Promise<StandardApiResponse<Category>> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['services'],
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return {
        isSuccess: true,
        data: category,
        error: null,
      };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to find category';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }

  async delete(id: string): Promise<StandardApiResponse<Category>> {
    try {
      const categoryToDelete = await this.categoryRepository.findOneBy({ id });
      const result = await this.categoryRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return { isSuccess: true, data: categoryToDelete, error: null };
    } catch (error) {
      const fallbackErrorMessage = 'Failed to delete category';
      return {
        isSuccess: false,
        data: null,
        error: error?.message ?? fallbackErrorMessage,
      };
    }
  }
}
