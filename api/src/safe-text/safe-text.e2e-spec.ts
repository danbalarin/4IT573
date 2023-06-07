import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { mainConfig } from '../../main.config';
import { SafeTextService } from './safe-text.service';

describe('/safe-text SafeTextModule', () => {
  let app: INestApplication;
  let authCookie: string;
  let evilAuthCookie: string;
  let safeTextService: SafeTextService;

  let userId: string;
  let expectedText: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    safeTextService = moduleFixture.get<SafeTextService>(SafeTextService);

    mainConfig(app);

    await app.init();

    if (!authCookie) {
      const res = await request(app.getHttpServer()).post('/auth/signup').send({
        email: 'safe-text@example.com',
        password: 'Test123',
      });

      userId = res.body.id;

      authCookie = decodeURI(res.header['set-cookie'][0].split(';')[0]);
    }

    if (!evilAuthCookie) {
      const res = await request(app.getHttpServer()).post('/auth/signup').send({
        email: 'safe-text-evil@example.com',
        password: 'Test123',
      });

      evilAuthCookie = decodeURI(res.header['set-cookie'][0].split(';')[0]);
    }
  });

  it('/ (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/safe-text')
      .set('Cookie', [authCookie])
      .send({
        text: 'password',
      })
      .expect(201);

    expectedText = 'password';

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('domain');
    expect(res.body).toHaveProperty('text');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('updatedAt');

    const saved = await safeTextService.findOne(res.body.id);

    expect(saved).toMatchObject({
      id: res.body.id,
      domain: res.body.domain,
      text: res.body.text,
      createdAt: new Date(res.body.createdAt),
      updatedAt: new Date(res.body.updatedAt),
    });
  });

  it('/ (POST) auth validation', async () => {
    const res = await request(app.getHttpServer())
      .post('/safe-text')
      // .set('Cookie', [authCookie]) // Skipping cookie, not authorized
      .send({
        text: 'password',
      })
      .expect(401);

    expect(res.body).not.toHaveProperty('id');
  });

  it('/ (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/safe-text')
      .set('Cookie', [authCookie])
      .expect(200);

    const saved = await safeTextService.findManyByUserId(+userId);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(saved.length);
    expect(res.body).toMatchObject(JSON.parse(JSON.stringify(saved))); // Remove Date objects
  });

  it('/ (GET) auth validation', async () => {
    const res = await request(app.getHttpServer())
      .get('/safe-text')
      // .set('Cookie', [authCookie]) // Skipping cookie, not authorized
      .expect(401);

    expect(res.body).not.toBeInstanceOf(Array);
  });

  it('/ (GET) permission validation', async () => {
    const res = await request(app.getHttpServer())
      .get('/safe-text')
      .set('Cookie', [evilAuthCookie])
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(0);
  });

  it('/:id (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/safe-text/1')
      .set('Cookie', [authCookie])
      .expect(200);

    const saved = await safeTextService.findOne(1);

    expect(res.body).toMatchObject(JSON.parse(JSON.stringify(saved))); // Remove Date objects
  });

  it('/:id (GET) not found', async () => {
    await request(app.getHttpServer())
      .get('/safe-text/9999')
      .set('Cookie', [authCookie])
      .expect(404);
  });

  it('/:id (GET) auth validation', async () => {
    const res = await request(app.getHttpServer())
      .get('/safe-text/1')
      // .set('Cookie', [authCookie]) // Skipping cookie, not authorized
      .expect(401);

    expect(res.body).not.toHaveProperty('id');
  });

  it('/:id (GET) permission validation', async () => {
    const res = await request(app.getHttpServer())
      .get('/safe-text/1')
      .set('Cookie', [evilAuthCookie])
      .expect(404);

    expect(res.body).not.toHaveProperty('id');
  });

  it('/:id (PATCH)', async () => {
    expectedText = 'NEW_PASSWORD';

    const res = await request(app.getHttpServer())
      .patch('/safe-text/1')
      .set('Cookie', [authCookie])
      .send({
        text: expectedText,
      })
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('domain');
    expect(res.body).toHaveProperty('text');
    expect(res.body.text).toBe(expectedText);
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('updatedAt');

    const saved = await safeTextService.findOne(res.body.id);

    expect(saved.text).toBe(expectedText);
  });

  it('/:id (PATCH) not found', async () => {
    await request(app.getHttpServer())
      .patch('/safe-text/9999')
      .set('Cookie', [authCookie])
      .send({
        text: 'EVIL_PASSWORD',
      })
      .expect(404);
  });

  it('/:id (PATCH) auth validation', async () => {
    const res = await request(app.getHttpServer())
      .patch('/safe-text/1')
      // .set('Cookie', [authCookie]) // Skipping cookie, not authorized
      .send({
        text: 'EVIL_PASSWORD',
      })
      .expect(401);

    expect(res.body).not.toHaveProperty('id');
    expect(expectedText).not.toBe('EVIL_PASSWORD'); // Sanity check

    const saved = await safeTextService.findOne(1);

    // Not updated
    expect(saved.text).toBe(expectedText);
  });

  it('/:id (PATCH) permission validation', async () => {
    const res = await request(app.getHttpServer())
      .patch('/safe-text/1')
      .set('Cookie', [evilAuthCookie])
      .send({
        text: 'EVIL_PASSWORD',
      })
      .expect(404);

    expect(res.body).not.toHaveProperty('id');
    expect(expectedText).not.toBe('EVIL_PASSWORD'); // Sanity check

    const saved = await safeTextService.findOne(1);

    // Not updated
    expect(saved.text).toBe(expectedText);
  });

  it('/:id (DELETE) auth validation', async () => {
    const res = await request(app.getHttpServer())
      .delete('/safe-text/1')
      // .set('Cookie', [authCookie]) // Skipping cookie, not authorized
      .expect(401);

    expect(res.body).not.toHaveProperty('id');

    const saved = await safeTextService.findOne(1);

    // Not deleted
    expect(saved.id).toBe(1);
  });

  it('/:id (DELETE) permission validation', async () => {
    const res = await request(app.getHttpServer())
      .delete('/safe-text/1')
      .set('Cookie', [evilAuthCookie])
      .expect(404);

    expect(res.body).not.toHaveProperty('id');

    const saved = await safeTextService.findOne(1);

    // Not deleted
    expect(saved.id).toBe(1);
  });

  it('/:id (DELETE)', async () => {
    const res = await request(app.getHttpServer())
      .delete('/safe-text/1')
      .set('Cookie', [authCookie])
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('domain');
    expect(res.body).toHaveProperty('text');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('updatedAt');

    const saved = await safeTextService.findOne(1);

    expect(saved).toBe(null);
  });
});
