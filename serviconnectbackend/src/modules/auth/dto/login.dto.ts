import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'jorge@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '(>xe/h.4RN' })
  @IsNotEmpty()
  password: string;
}
