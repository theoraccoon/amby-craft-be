import { BadRequestException, Injectable, ValidationPipe as NestValidationPipe, ValidationError } from '@nestjs/common';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = validationErrors.map(error => {
          return {
            field: error.property,
            errors: Object.values(error.constraints || {}),
          };
        });
        return new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      },
    });
  }
}
