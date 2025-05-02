export class ApiResponseExample {
    static success<T>(
        statusCode: number,
        message: string,
        data: T = {} as T
    ): { statusCode: number; message: string; data: T } {
        return {
            statusCode,
            message,
            data,
        };
    }

    static error(
        statusCode: number,
        message: string
    ): { statusCode: number; message: string } {
        return {
            statusCode,
            message,
        };
    }
}
