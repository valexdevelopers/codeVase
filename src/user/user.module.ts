import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { GenereteTokenService } from 'src/helpers/generatetoken.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { VerificationMailService } from 'src/emails/verificationmail.service';
import { VerifyTokenService } from 'src/helpers/verifyToken.service';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { LocalAuthJwtStrategy } from 'src/strategy/localAuth.jwt.strategy';
import { UserAccessTokenGuard } from 'src/guards/user.accesstoken.guard copy';
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
    LocalAuthJwtStrategy,
    {
      provide: APP_GUARD,
      useClass: UserAccessTokenGuard,
    }

  ],
})
export class UserModule {}
