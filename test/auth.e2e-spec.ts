import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { initApp } from '../src/app.init';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/modules/user/user.service';

describe('Authentication', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    initApp(app);
    await app.init();

    const userService = moduleRef.get<UserService>(UserService);
    await userService.resetData();
  });

  it(`Register user - Missing username`, () => {
    return request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        email: 'asd2@no.no',
        password: 'test1234',
      })
      .expect(422);
  });

  it(`Register user - Missing email`, () => {
    return request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        username: 'test12345',
        password: 'test1234',
      })
      .expect(422);
  });

  it(`Register user - Missing password`, () => {
    return request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        username: 'test12345',
        email: 'asd2@no.no',
      })
      .expect(422);
  });

  it(`Register user - Invalid email format`, () => {
    return request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        username: 'test12345',
        email: 'asd2@no',
        password: 'test1234',
      })
      .expect(422);
  });

  it(`Register user - Correct case`, () => {
    return request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        username: 'test12345',
        email: 'asd2@no.no',
        password: 'test1234',
      })
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body).toHaveProperty('token');
      });
  });

  it(`Register user - Duplicate username`, () => {
    return request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        username: 'test12345',
        email: 'no@no.no',
        password: 'test1234',
      })
      .expect(422);
  });

  it(`Register user - Duplicate email`, () => {
    return request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        username: 'test123456',
        email: 'asd2@no.no',
        password: 'test1234',
      })
      .expect(422);
  });

  it(`Register user - Register second user`, () => {
    return request(app.getHttpServer())
      .post('/v1/auth/register')
      .send({
        username: 'test123456',
        email: 'no@no.no',
        password: 'test1234',
      })
      .expect(201)
      .expect((response: request.Response) => {
        expect(response.body).toHaveProperty('token');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
