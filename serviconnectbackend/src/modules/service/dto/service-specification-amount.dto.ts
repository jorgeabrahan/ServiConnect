import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, Min, Max, IsNumber } from 'class-validator';

export class ServiceSpecificationAmountDto {
  @ApiProperty({ example: 'beds amount' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  min: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  max: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  interval: number; 
}
