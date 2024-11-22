import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Validate,
} from 'class-validator';
import { IsTimeString } from 'src/common/decorators';

export class ServiceDto {
  @ApiProperty({ example: 'f9813ce5-aadb-44d8-aa42-6c9b1056db5e' })
  @IsNotEmpty()
  @IsUUID()
  category: string;

  @ApiProperty({
    example:
      'https://ik.imagekit.io/heg9sccdt/home-cleaning.jpeg?updatedAt=1732130638295',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'Home Cleaning' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'Home or apartment cleaning, if you want your dwelling to be spotless we are the best option for you',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  minHoursToBook: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  maxHoursToBook: number;

  @ApiProperty({ example: '07:00' })
  @IsString()
  @Validate(IsTimeString)
  minTimeToSchedule: string;

  @ApiProperty({ example: '21:00' })
  @IsString()
  @Validate(IsTimeString)
  maxTimeToSchedule: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  hourlyRate: number;
}
