import { IsUUID, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ServiceRequestSpecificationAmountDto {
  @ApiProperty()
  @IsUUID()
  serviceSpecificationAmountId: string;

  @ApiProperty()
  @IsInt()
  value: number;
}
