import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ExcludeFieldsInterceptor implements NestInterceptor {
  constructor(private readonly fieldsToExclude: string[] = []) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => this.excludeFields(data)));
  }

  private excludeFields(data: any): any {
    if (Array.isArray(data)) {
      return data.map(item => this.strip(item));
    } else if (typeof data === 'object' && data !== null) {
      return this.strip(data);
    }
    return data;
  }

  private strip(obj: Record<string, any>) {
    const cleaned = { ...obj };
    for (const field of this.fieldsToExclude) {
      delete cleaned[field];
    }
    return cleaned;
  }
}
