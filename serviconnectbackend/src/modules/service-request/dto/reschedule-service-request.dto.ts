import { IsString, IsDateString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsTimeString } from 'src/common/decorators';

export class RescheduleServiceRequestDto {
  @ApiProperty({
    example: '2024-12-01',
    description: 'New date for the service request',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: '14:00',
    description: 'New time for the service request',
  })
  @IsString()
  @Validate(IsTimeString)
  time: string;
}
