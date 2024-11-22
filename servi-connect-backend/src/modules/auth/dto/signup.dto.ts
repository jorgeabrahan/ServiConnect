import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Jorge' })
  @IsNotEmpty()
  firstName: string;
  
  @ApiProperty({ example: 'Perez' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '97707385' })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: '504' })
  @IsNotEmpty()
  phoneNumberAreaCode: string;

  @ApiProperty()
  description: string;
  
  @ApiProperty({ example: 'jorge@gmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '(>xe/h.4RN' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '(>xe/h.4RN' })
  @IsNotEmpty()
  passwordConfirmation: string;
}
