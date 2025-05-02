import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ enum: ['success', 'error'] })
  status: 'success' | 'error';

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ type: [String], required: false })
  errors?: any[];

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

  static error(message: string, errors?: any[]): ApiResponse<null> {
    return new ApiResponse<null>({
      status: 'error',
      message,
      errors,
    });
  }
}
