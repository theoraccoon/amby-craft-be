import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express'; 

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, ApiResponse<T>>
{
    constructor(
        private readonly defaultMessage: string = 'Request successful'
    ) {}
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>
    ): Observable<ApiResponse<T>> {
        return next.handle().pipe(
            map((data: T) => {
                const http = context.switchToHttp();
                const response = http.getResponse<Response>();

                return {
                    statusCode: response.statusCode,
                    message: this.defaultMessage,
                    data,
                };
            })
        );
    }
}
