import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  ArrayNotEmpty,
  IsArray,
} from 'class-validator';

export class ServiceTraitDto {
  @ApiProperty({ example: 'Bedroom, Living Room & Common Areas' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({
    example: [
      'Dust all accessible surfaces',
      'Wipe down all mirrors and glass fixtures',
      'Clean all floor surfaces',
      'Take out garbage and recycling',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  bulletPoints: string[];
}
