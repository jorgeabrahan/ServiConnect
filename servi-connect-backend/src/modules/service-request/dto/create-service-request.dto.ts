import { IsUUID, IsString, IsDateString, IsInt, IsArray, ValidateNested, Validate, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ServiceRequestSpecificationAmountDto } from './service-request-specification-amount.dto';
import { IsTimeString } from 'src/common/decorators';

export class CreateServiceRequestDto {
  @ApiProperty({ example: '6e1ab068-8d8f-441a-8357-5edb753f6acd', required: true })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ example: '', required: false })
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDateString()
  date: string;
  
  @ApiProperty()
  @IsString()
  @Validate(IsTimeString)
  time: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  hoursBooked: number;

  @ApiProperty({ type: [ServiceRequestSpecificationAmountDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceRequestSpecificationAmountDto)
  specificationAmounts: ServiceRequestSpecificationAmountDto[];
}
