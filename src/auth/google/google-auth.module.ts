import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
    imports: [PassportModule.register({ session: true })],
    providers: [GoogleStrategy],
    exports: [],
})
export class GoogleAuthModule {}
