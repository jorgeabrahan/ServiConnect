import { IsString, IsBoolean, IsOptional, IsIn, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsTimeString } from 'src/common/decorators';

export class ProfessionalUserScheduleDto {
  @ApiProperty({
    enum: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    example: 'monday',
  })
  @IsIn([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ])
  day:
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

  @ApiProperty({ required: false, example: '08:00' })
  @IsOptional()
  @IsString()
  @Validate(IsTimeString)
  startTime?: string;

  @ApiProperty({ required: false, example: '17:00' })
  @IsOptional()
  @IsString()
  @Validate(IsTimeString)
  endTime?: string;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
