import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserAddressDto {
  @ApiProperty({ example: '7 AVE, 36 y 37 CA' })
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Residencial Villa Olimpica' })
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ example: '21103' })
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: 'a903c2c7-269b-4cb4-8cca-d1b9bc70dc34' })
  @IsNotEmpty()
  @IsUUID()
  countryDepartmentCity: string;
}
