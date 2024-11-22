import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCountryDepartmentDto {
  @ApiProperty({ example: 'Cortés' })
  @IsNotEmpty()
  title: string;
}
