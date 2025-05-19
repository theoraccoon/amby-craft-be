import { IsString, IsNumber, IsObject } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlockType } from '@prisma/client';

export class CreateBlockDto {
  @ApiProperty()
  @IsString()
  type: BlockType;

  @ApiProperty()
  @IsObject()
  content: Record<string, any>;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsString()
  lessonId: string;
}
