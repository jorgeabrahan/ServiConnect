import { Test, TestingModule } from '@nestjs/testing';
import { CountryDepartmentController } from './country-department.controller';
import { CountryDepartmentService } from './country-department.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CountryDepartment, CountryDepartmentCity } from 'src/core/domain/entities';
import { StandardApiResponse } from 'src/common/interfaces';

describe('CountryDepartmentController', () => {
  let controller: CountryDepartmentController;
  let service: CountryDepartmentService;

  const mockCountryDepartment: StandardApiResponse<CountryDepartment> = {
    isSuccess: true,
    data: {
      id: '1',
      title: 'Department1',
      cities: [],
    },
    error: null,
  };

  const mockCountryDepartmentCity: StandardApiResponse<CountryDepartmentCity> = {
    isSuccess: true,
    data: {
      id: '1',
      title: 'City1',
      countryDepartment: {
        id: '1',
        title: 'Department1',
        cities: [],
      } as CountryDepartment,
    },
    error: null,
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockCountryDepartment),
    update: jest.fn().mockResolvedValue(mockCountryDepartment),
    delete: jest.fn().mockResolvedValue(mockCountryDepartment),
    findOne: jest.fn().mockResolvedValue(mockCountryDepartment),
    findAll: jest.fn().mockResolvedValue([mockCountryDepartment]),
    addCity: jest.fn().mockResolvedValue(mockCountryDepartmentCity),
    deleteCity: jest.fn().mockResolvedValue(mockCountryDepartmentCity),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryDepartmentController],
      providers: [
        CountryDepartmentService,
        {
          provide: getRepositoryToken(CountryDepartment),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CountryDepartmentCity),
          useValue: {},
        },
        {
          provide: CountryDepartmentService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CountryDepartmentController>(CountryDepartmentController);
    service = module.get<CountryDepartmentService>(CountryDepartmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a country department', async () => {
    const dto = { title: 'New Department' };
    const result = await controller.create(dto as CountryDepartment);
    expect(result).toEqual(mockCountryDepartment);
    expect(mockService.create).toHaveBeenCalledWith(dto);
  });

  it('should update a country department', async () => {
    const dto = { title: 'Updated Department' };
    const result = await controller.update('1', dto);
    expect(result).toEqual(mockCountryDepartment);
    expect(mockService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a country department', async () => {
    const result = await controller.delete('1');
    expect(result).toEqual(mockCountryDepartment);
    expect(mockService.delete).toHaveBeenCalledWith('1');
  });

  it('should find one country department', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockCountryDepartment);
    expect(mockService.findOne).toHaveBeenCalledWith('1');
  });

  it('should find all country departments', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockCountryDepartment]);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should add a city to a country department', async () => {
    const dto = { title: 'New City' };
    const result = await controller.addCity('1', dto as CountryDepartmentCity);
    expect(result).toEqual(mockCountryDepartmentCity);
    expect(mockService.addCity).toHaveBeenCalledWith('1', dto);
  });

  it('should delete a city', async () => {
    const result = await controller.deleteCity('1');
    expect(result).toEqual(mockCountryDepartmentCity);
    expect(mockService.deleteCity).toHaveBeenCalledWith('1');
  });
});
