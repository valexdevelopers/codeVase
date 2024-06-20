import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    const Cors = {
        origin: ['http://localhost:3000'],
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization', , 'x-csrf-token'], // Allow these headers
        credentials: true, // Allow sending cookies and authorization headers
    };
    app.enableCors(Cors);
    app.use(helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: [`'self'`],
                scriptSrc: [`'self'`],
                manifestSrc: [`'self'`],
                frameSrc: [`'self'`],
                styleSrc: ["'self'"],
                connectSrc: ["'self'", , "http://localhost:3000"],
                fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
    }));
    app.enableCors(Cors);
    app.use(cookieParser());
    //app.use(csurf({ cookie: true }));
    //Custom CSRF middleware to exempt Swagger
    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.url.startsWith('/api/v1')) {
            // Skip CSRF protection for Swagger
            return next();
        }
        csurf({ cookie: true })(req, res, next);
    });
    const Options = new DocumentBuilder()
        .setTitle('CodeVase Api version 1.0.0')
        .setDescription(`Codebase is an online learning tool for beginers to write code, run their code and test their code`)
        .setVersion('version 1.0.0')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, Options);
    SwaggerModule.setup('api/v1', app, document);

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(4000);
    }
bootstrap();
