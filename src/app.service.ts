import { API_CONSTANTS } from '@config/constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): string {
    return API_CONSTANTS.PONG;
  }
}
