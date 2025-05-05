import { BlockType } from '@prisma/client';

export class CreateBlockDto {
  type: BlockType;
  content: Record<string, any>;
  order: number;
}
