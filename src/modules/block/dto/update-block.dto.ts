import { IsEnum, IsOptional, IsObject } from 'class-validator';
import { BlockType } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlockDto {
  @ApiPropertyOptional({ enum: BlockType, description: 'Type of block (e.g., TEXT, IMAGE, VIDEO)' })
  @IsOptional()
  @IsEnum(BlockType)
  type?: BlockType;

  @ApiPropertyOptional({ type: Object, description: 'Block content in JSON format' })
  @IsOptional()
  @IsObject()
  content?: Record<string, any>;
}
