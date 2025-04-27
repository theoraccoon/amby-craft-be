import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiResponseExample } from 'src/helper/api-response-example';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: 'User signup',
        description: `
Create a new user account.

## Request Body
- **email**: User's email address
- **password**: User's password
- **name**: User's full name

Example:

\`\`\`json
{
"email": "user@example.com",
"password": "securepassword123",
"name": "John Doe"
}
\`\`\`

## Responses
- **200**: Signup successful
- **400**: User already exists

[Read more about account creation](https://yourdomain.com/docs/auth/signup)
        `,
    })
    @ApiResponse({
        status: 200,
        description: 'Signup successful',
        schema: {
            example: ApiResponseExample.success(200, 'request successful'),
        },
    })
    @ApiResponse({
        status: 400,
        description: 'User already exists',
        schema: {
            example: ApiResponseExample.error(
                400,
                'User with this email already exists'
            ),
        },
    })
    @Post('signup')
    async signup(@Body(ValidationPipe) body: CreateUserDto) {
        return this.authService.validateUser(body);
    }

    @ApiOperation({
        summary: 'User login',
        description: `


Authenticate an existing user and retrieve an access token.

## Request Body
- **email**: Registered email address
- **password**: Associated password

Example:

\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
\`\`\`

## Responses
- **200**: Login successful
- **400**: Invalid credentials

Upon successful login, you will receive a JWT token:

\`\`\`json
{
  "access_token": "your.jwt.token.here"
}
\`\`\`

[Learn more about authentication](https://yourdomain.com/docs/auth/login)
        `,
    })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        schema: {
            example: ApiResponseExample.success(200, 'request successful'),
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid credentials',
        schema: {
            example: ApiResponseExample.error(400, 'Invalid credentials'),
        },
    })
    @Post('login')
    async login(@Body(ValidationPipe) body: LoginDto) {
        return this.authService.login(body);
    }
}
