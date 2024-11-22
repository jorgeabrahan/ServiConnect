import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @ApiProperty({ example: 'Cleaning' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Services related to cleaning' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
