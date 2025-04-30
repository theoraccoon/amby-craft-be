import { CallHandler, ExecutionContext } from '@nestjs/common';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { of } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { ApiResponse } from 'src/common/dtos/api-response.dto';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should wrap response in BaseApiResponse.success()', async () => {
    const data = { id: 1, name: 'Test' };

    const context = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () => of(data),
    };

    const result = await lastValueFrom(interceptor.intercept(context, callHandler));

    expect(result).toBeInstanceOf(ApiResponse);
    expect(result.status).toBe('success');
    expect(result.message).toBe('Success');
    expect(result.data).toEqual(data);
    expect(result.timestamp).toBeInstanceOf(Date);
    expect(result.errors).toBeUndefined();
  });
});
