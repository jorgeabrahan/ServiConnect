import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCountryDepartmentCityDto {
  @ApiProperty({ example: 'San Pedro Sula' })
  @IsNotEmpty()
  title: string;
}
