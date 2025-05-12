import { CreateBlockDto } from '../dto/create-block.dto';

export class CreateBlockCommand {
  constructor(public readonly createBlockRequest: CreateBlockDto) {}
}
