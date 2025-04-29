import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { API_CONSTANTS } from '@config/constants';

@ApiTags(API_CONSTANTS.HEALTH_CHECK)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(API_CONSTANTS.PING)
  ping(): string {
    return this.appService.ping();
  }
}
