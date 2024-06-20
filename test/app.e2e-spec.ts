import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/user/register (POST)', () => {
        return request(app.getHttpServer())
            .post('/')
            .send({
                fullname: "virtue Egerega",
                email: "egeregav@gmail.com",
                password: "Virtue@1998",
                password_confirmation: "Virtue@1998"
            } )// Send data along with the request
            .expect(201) // Set the expected status code
            .expect('Content-Type', /json/); // Set the expected content type
    });
});
