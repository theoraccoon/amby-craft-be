import { ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionFilter } from '../../../src/common/filters/http-exception.filter';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

describe('HttpExceptionFilter', () => {
  it('should handle HttpException cleanly', () => {
    const jsonMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    const mockResponse = {
      status: statusMock,
    } as unknown as Response;

    const mockHttpContext: HttpArgumentsHost = {
      getResponse: <T>() => mockResponse as T,
      getRequest: jest.fn(),
      getNext: jest.fn(),
    };

    const mockHost: ArgumentsHost = {
      switchToHttp: () => mockHttpContext,
    } as ArgumentsHost;

    const filter = new HttpExceptionFilter();

    const exception = new HttpException({ message: 'Not Found' }, HttpStatus.NOT_FOUND);
    filter.catch(exception, mockHost);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'Not Found',
      }),
    );
  });
});
