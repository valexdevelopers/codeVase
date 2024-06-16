import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import configuration, { validationSchema } from './config';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DatabaseService } from './database/database.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [configuration],
            validationSchema,
            validate,
            validationOptions: {
                allowUnknown: false,
                abortEarly: true,
            },
        }),
        UserModule,
        AdminModule,
        ThrottlerModule.forRoot([
            {
                name: "short",
                ttl: 1000,
                limit: 3
            },

            {
                name: "medium",
                ttl: 9000,
                limit: 4
            },

            {
                name: "long",
                ttl: 12000,
                limit: 5
            },
        ])
    ],
  controllers: [AppController],
    providers: [
        AppService,
        DatabaseService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
        
    ],
})
export class AppModule {}
