import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalAdminAuthJwtStrategy } from '../strategy/localAdminAuth.jwt.strategy';
import { AdminAccessTokenGuard } from '../guards/admin.accesstoken.guard';
import { APP_GUARD } from '@nestjs/core';
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
  controllers: [TaskController],
  providers: [
    TaskService,
    DatabaseService,
    LocalAdminAuthJwtStrategy,


  ],
})
export class TaskModule { }
