import { API_CONSTANTS } from '@common/config/constants';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(API_CONSTANTS.GOOGLE) {}
