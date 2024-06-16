import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { GenereteTokenService } from 'src/helpers/generatetoken.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { VerificationMailService } from 'src/emails/verificationmail.service';

@Module({
  imports: [
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN
        }
      }),
      MailerModule.forRoot({
        transport: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: process.env.SMTP_SECURITY,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          },
          connectionTimeout: 10000 //10 seconds
        }
      }),
  ],
  controllers: [AdminController],
  providers: [AdminService, DatabaseService, JwtService, GenereteTokenService, VerificationMailService],
})
export class AdminModule {}
