import { IsUUID, IsString, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfessionalUserServiceDto {
  @ApiProperty({ example: 'dadefede-3af6-40cc-b8f4-5ed5e2057c95' })
  @IsUUID()
  serviceId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  yearsOfExperience: number;

  @ApiProperty({
    example:
      "I have a proven track record of jobs in this area, from cleaning small houses to really big ones, from slightly clean houses to a very mess, and in all my jobs I've demonstrated nothing more but pure professionalism exceeding expectations and going beyond of what I'm asked to do, if you need this service in your house, I'm your guy!",
  })
  @IsString()
  description: string;
}
