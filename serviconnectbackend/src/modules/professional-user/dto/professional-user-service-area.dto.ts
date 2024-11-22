import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfessionalUserServiceAreaDto {
  @ApiProperty({ example: 'a903c2c7-269b-4cb4-8cca-d1b9bc70dc34' })
  @IsUUID()
  countryDepartmentCityId: string;
}
