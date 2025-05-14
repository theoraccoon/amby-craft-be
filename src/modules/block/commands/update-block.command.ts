import { UpdateBlockDto } from '../dto/update-block.dto';

export class UpdateBlockCommand {
  constructor(
    public readonly blockId: string,
    public readonly dto: UpdateBlockDto,
    public readonly userId: string,
  ) {}
}
