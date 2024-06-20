import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { GenereteTokenService } from '../helpers/generatetoken.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { VerificationMailService } from '../emails/verificationmail.service';
import { VerifyTokenService } from '../helpers/verifyToken.service';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { LocalUserAuthJwtStrategy } from '../strategy/localUserAuthJwtStrategy';
import { UserAccessTokenGuard } from '../guards/user.accesstoken.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get<string | number>('JWT_ACCESS_TOKEN_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        // secure: process.env.SMTP_SECURITY,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        // connectionTimeout: 10000 //10 seconds
      }
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    DatabaseService,
    JwtService,
    GenereteTokenService,
    VerificationMailService,
    VerifyTokenService,
    LocalUserAuthJwtStrategy,
    UserAccessTokenGuard

  ],
})
export class UserModule { }
