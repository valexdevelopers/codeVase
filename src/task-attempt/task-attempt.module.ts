import { Module } from '@nestjs/common';
import { TaskAttemptService } from './task-attempt.service';
import { TaskAttemptController } from './task-attempt.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalUserAuthJwtStrategy } from '../strategy/localUserAuthJwtStrategy';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';


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
    })
  ],
  controllers: [TaskAttemptController],
  providers: [
    TaskAttemptService,
    DatabaseService,
    LocalUserAuthJwtStrategy,


  ],
})
export class TaskAttemptModule { }
