import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AdminService } from '../src/admin/admin.service';
import { DatabaseService } from '../src/database/database.service'; // Adjust the import path as necessary
import { GenereteTokenService } from '../src/helpers/generatetoken.service';
import { VerificationMailService } from '../src/emails/verificationmail.service';
import { ConfigService } from '@nestjs/config';
import { VerifyTokenService } from '../src/helpers/verifytoken.service';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        let service: AdminService;
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, DatabaseService],
            providers: [
                AdminService,
                DatabaseService, // Add DatabaseService to the providers array
                GenereteTokenService,
                VerificationMailService,
                ConfigService,
                VerifyTokenService,
            ],
        }).compile();
        service = moduleFixture.get<AdminService>(AdminService);
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/ (GET)', () => {
        return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });
    
    it('/user/register (POST) - success', async () => {
        const createUserDto = { username: 'test user', email: 'test@example.com', password: 'FakePassword@123', password_confirmation: 'FakePassword@123' };

        const response = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe('testuser');
        expect(response.body.email).toBe('test@example.com');
    });

    it('/user/register (POST) - validation error', async () => {
        const createUserDto = { fullname: '', email: 'invalid-email', password: '123', password_confirmation: '' };

        const response = await request(app.getHttpServer())
            .post('/users/register')
            .send(createUserDto)
            .expect(400);

        expect(response.body.message).toContain('username should not be empty');
        expect(response.body.message).toContain('email must be an email');
        expect(response.body.message).toContain('password must be longer than or equal to 6 characters');
    });

    afterAll(async () => {
        await app.close();
    });
});


  

  

