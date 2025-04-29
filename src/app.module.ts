import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { GoogleAuthModule } from '@google/google-auth.module';

@Module({
  imports: [GoogleAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
