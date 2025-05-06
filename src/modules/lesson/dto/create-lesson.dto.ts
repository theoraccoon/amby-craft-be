import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsString()
  courseId: string;
}
