import { IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    example: 'Great service!',
    description: 'Comment for the review',
  })
  @IsString()
  comment: string;

  @ApiProperty({
    example: 5,
    description: 'Score for the service request',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;
}
