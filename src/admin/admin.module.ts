import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseService } from '../database/database.service';
import { DatabaseModule } from '../database/database.module';
import { JwtService } from '@nestjs/jwt';
import { GenereteTokenService } from '../helpers/generatetoken.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { VerificationMailService } from '../emails/verificationmail.service';
import { VerifyTokenService } from '../helpers/verifyToken.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalAdminAuthJwtStrategy } from '../strategy/localAdminAuth.jwt.strategy';
import { AdminAccessTokenGuard } from '../guards/admin.accesstoken.guard';


@Module({
  imports: [
    DatabaseModule,
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
  controllers: [AdminController],
  providers: [
    AdminService,

    DatabaseService,
    JwtService,
    LocalAdminAuthJwtStrategy,
    GenereteTokenService,
    VerificationMailService,
    VerifyTokenService,


  ],
})
export class AdminModule { }
