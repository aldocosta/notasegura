import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Notes (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api', { exclude: ['/'] });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    if (app) await app.close();
  });

  it('creates a note', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/notes')
      .send({ text: 'hello', expiresInDays: 1, maxViews: 1 });
    expect(res.status).toBe(201);
    const body = res.body as { id: string; url: string };
    expect(typeof body.id).toBe('string');
    expect(body.id.length).toBeGreaterThan(0);
    expect(body.url).toBe(`/notes/${body.id}`);
  });

  it('reads a note with the original plaintext', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/notes')
      .send({ text: 'hello', expiresInDays: 1, maxViews: 1 });
    const createdBody = created.body as { id: string };
    const res = await request(app.getHttpServer()).get(
      `/api/notes/${createdBody.id}`,
    );
    expect(res.status).toBe(200);
    expect((res.body as { text: string }).text).toBe('hello');
  });

  it('requires the passphrase when the note is protected', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/notes')
      .send({ text: 'secret', expiresInDays: 1, maxViews: 1, passphrase: 'p' });
    const createdBody = created.body as { id: string };
    const res = await request(app.getHttpServer()).get(
      `/api/notes/${createdBody.id}`,
    );
    expect(res.status).toBe(401);
  });

  it('rejects a wrong passphrase', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/notes')
      .send({ text: 'secret', expiresInDays: 1, maxViews: 1, passphrase: 'p' });
    const createdBody = created.body as { id: string };
    const res = await request(app.getHttpServer()).get(
      `/api/notes/${createdBody.id}?passphrase=wrong`,
    );
    expect(res.status).toBe(401);
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app.getHttpServer()).get(
      '/api/notes/000000000000000000000000',
    );
    expect(res.status).toBe(404);
  });

  it('rejects expiresInDays above 7', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/notes')
      .send({ text: 'hello', expiresInDays: 8, maxViews: 1 });
    expect(res.status).toBe(400);
  });

  it('rejects maxViews above 10', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/notes')
      .send({ text: 'hello', expiresInDays: 1, maxViews: 11 });
    expect(res.status).toBe(400);
  });

  it('returns 429 with Retry-After after 10 creates from one IP', async () => {
    for (let i = 0; i < 10; i++) {
      await request(app.getHttpServer())
        .post('/api/notes')
        .send({ text: 'hello', expiresInDays: 1, maxViews: 1 });
    }
    const res = await request(app.getHttpServer())
      .post('/api/notes')
      .send({ text: 'hello', expiresInDays: 1, maxViews: 1 });
    expect(res.status).toBe(429);
    expect(res.headers['retry-after']).toBeDefined();
  });

  it('answers the health check', async () => {
    const res = await request(app.getHttpServer()).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('keeps the root route', async () => {
    const res = await request(app.getHttpServer()).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello World!');
  });
});
