import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ enum: ['success', 'error'] })
  status: 'success' | 'error';

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ type: [Object] })
  errors?: unknown[];

  @ApiProperty()
  timestamp: Date;

  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial);
    this.timestamp = new Date();
  }

  static success<T>(data?: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>({
      status: 'success',
      message,
      data,
    });
  }

  static error(message: string, errors?: unknown[]): ApiResponse<null> {
    return new ApiResponse<null>({
      status: 'error',
      message,
      errors: errors,
    });
  }
}
