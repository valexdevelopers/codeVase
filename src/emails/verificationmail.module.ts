import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { VerificationMailService } from 'src/emails/verificationmail.service';

@Module({
  imports: [
      MailerModule.forRoot({
        transport: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
        //   secure: process.env.SMTP_SECURITY,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          },
        //   connectionTimeout: 10000 //10 seconds
        }
      }),
  ],
  controllers: [],
    providers: [VerificationMailService],
})
export class VerificationMailModule {}
