import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description?: string;
}
