import { Global, Module } from '@nestjs/common';
import { DatabaseService } from '@common/database/database.service';

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
