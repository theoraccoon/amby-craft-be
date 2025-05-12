import { IsJSON, IsString, IsNumber } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlockType } from '@prisma/client';

export class CreateBlockDto {
  @ApiProperty()
  @IsString()
  type: BlockType;

  @ApiProperty()
  @IsJSON()
  content: Record<string, any>;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsString()
  lessonId: string;
}
