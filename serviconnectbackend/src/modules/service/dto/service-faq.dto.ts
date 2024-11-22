import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ServiceFAQDto {
  @ApiProperty({ example: 'Can I skip or reschedule bookings?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({
    example: `You can reschedule any booking without penalty, so long as you do so at least 24 hours ahead of the scheduled start time.`,
  })
  @IsString()
  @IsNotEmpty()
  answer: string;
}
