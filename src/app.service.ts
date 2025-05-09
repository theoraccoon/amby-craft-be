import { API_CONSTANTS } from '@common/config/constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): string {
    return API_CONSTANTS.PONG;
  }
}
