import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mainConfig } from '../main.config';

describe('/safe-text SafeTextModule', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    mainConfig(app);

    await app.init();
  });

  it('/ (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/safe-text')
      .send({
        text: 'password',
      })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('createdAt');
    expect(res.body).not.toHaveProperty('updatedAt');

    const cookie = res.header['set-cookie'][0].split(';')[0];
    expect(cookie).toMatch(/^Authorization=Bearer/);
  });

  //   it('/signup (POST) password validation', async () => {
  //     let res = await request(app.getHttpServer())
  //       .post('/auth/signup')
  //       .send({
  //         email: 'test-password@example.com',
  //       })
  //       .expect(400);

  //     expect(res.body).toHaveProperty('password');

  //     res = await request(app.getHttpServer())
  //       .post('/auth/signup')
  //       .send({
  //         email: 'test-password@example.com',
  //         password: '123',
  //       })
  //       .expect(400);

  //     expect(res.body).toHaveProperty('password');

  //     res = await request(app.getHttpServer())
  //       .post('/auth/signup')
  //       .send({
  //         email: 'test-password@example.com',
  //         password: '123456789012345678901234567890',
  //       })
  //       .expect(400);

  //     expect(res.body).toHaveProperty('password');
  //   });

  //   it('/signup (POST) email validation', async () => {
  //     let res = await request(app.getHttpServer())
  //       .post('/auth/signup')
  //       .send({
  //         email: 'test@example.com',
  //         password: 'Test123',
  //       })
  //       .expect(400);

  //     expect(res.body).toHaveProperty('email');

  //     res = await request(app.getHttpServer())
  //       .post('/auth/signup')
  //       .send({
  //         email: 'test',
  //         password: 'Test123',
  //       })
  //       .expect(400);

  //     expect(res.body).toHaveProperty('email');
  //   });

  //   it('/login (POST)', async () => {
  //     const res = await request(app.getHttpServer())
  //       .post('/auth/login')
  //       .set('Accept', 'application/text')
  //       .send({
  //         email: 'test@example.com',
  //         password: 'Test123',
  //       })
  //       .buffer(true)
  //       .parse((res, cb) => {
  //         let data = Buffer.from('');
  //         res.on('data', function (chunk) {
  //           data = Buffer.concat([data, chunk]);
  //         });
  //         res.on('end', function () {
  //           cb(null, data.toString());
  //         });
  //       })
  //       .expect(200)
  //       .expect('set-cookie', /^Authorization=Bearer/);

  //     const cookie = res.header['set-cookie'][0].split(';')[0];

  //     expect(res.body).toBe(cookie.replace('Authorization=Bearer%20', ''));
  //   });

  //   it('/login (POST) validate email', async () => {
  //     let res = await request(app.getHttpServer())
  //       .post('/auth/login')
  //       .set('Accept', 'application/text')
  //       .send({
  //         email: 'test-nonexistent@example.com',
  //         password: 'Test123',
  //       })
  //       .expect(401);

  //     expect(res.body).toHaveProperty('email');

  //     res = await request(app.getHttpServer())
  //       .post('/auth/login')
  //       .set('Accept', 'application/text')
  //       .send({
  //         email: 'test-nonexistent',
  //         password: 'Test123',
  //       })
  //       .expect(400);

  //     expect(res.body).toHaveProperty('email');
  //   });

  //   it('/login (POST) validate password', async () => {
  //     let res = await request(app.getHttpServer())
  //       .post('/auth/login')
  //       .set('Accept', 'application/text')
  //       .send({
  //         email: 'test-nonexistent@example.com',
  //       })
  //       .expect(400);

  //     expect(res.body).toHaveProperty('password');

  //     res = await request(app.getHttpServer())
  //       .post('/auth/login')
  //       .set('Accept', 'application/text')
  //       .send({
  //         email: 'test@example.com',
  //         password: 'invalidPassword',
  //       })
  //       .expect(401);

  //     expect(res.body).toHaveProperty('password');
  //   });
});
