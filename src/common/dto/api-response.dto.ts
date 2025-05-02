import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
    @ApiProperty({
        description: 'The status code of the response',
        example: 200,
    })
    statusCode: number;

    @ApiProperty({
        description: 'A message describing the result of the request',
        example: 'Request successful',
    })
    message: string;

    @ApiProperty({ description: 'The actual data of the response' })
    data: T;
}
