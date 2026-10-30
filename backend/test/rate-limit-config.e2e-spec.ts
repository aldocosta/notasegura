import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, disconnect } from 'mongoose';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { RATE_LIMIT_COLLECTION_NAME } from './../src/platform/rate-limit/rate-limit.constants';

const VALID_NOTE = { text: 'hello', expiresInDays: 1, maxViews: 1 };

async function buildApp(): Promise<INestApplication<App>> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication<INestApplication<App>>();
  app.setGlobalPrefix('api', { exclude: ['/'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();
  return app;
}

function useCreateMax(value: string): void {
  let previous: string | undefined;
  beforeAll(() => {
    previous = process.env.RATE_LIMIT_CREATE_MAX;
    process.env.RATE_LIMIT_CREATE_MAX = value;
  });
  afterAll(() => {
    if (previous === undefined) delete process.env.RATE_LIMIT_CREATE_MAX;
    else process.env.RATE_LIMIT_CREATE_MAX = previous;
  });
}

function useApp(): () => INestApplication<App> {
  let app: INestApplication<App>;
  beforeAll(async () => {
    app = await buildApp();
  });
  beforeEach(async () => {
    await app
      .get<Connection>(getConnectionToken())
      .collection(RATE_LIMIT_COLLECTION_NAME)
      .deleteMany({});
  });
  afterAll(async () => {
    if (app) await app.close();
  });
  return () => app;
}

describe('Rate limit configuration (e2e)', () => {
  describe('with RATE_LIMIT_CREATE_MAX=2', () => {
    useCreateMax('2');
    const getApp = useApp();

    it('returns 429 on the 3rd create', async () => {
      for (let i = 0; i < 2; i++) {
        const res = await request(getApp().getHttpServer())
          .post('/api/notes')
          .send(VALID_NOTE);
        expect(res.status).toBe(201);
      }
      const res = await request(getApp().getHttpServer())
        .post('/api/notes')
        .send(VALID_NOTE);
      expect(res.status).toBe(429);
      expect(res.headers['retry-after']).toBeDefined();
    });
  });

  describe('with RATE_LIMIT_CREATE_MAX=70', () => {
    useCreateMax('70');
    const getApp = useApp();

    it('accepts 70 creates in one window', async () => {
      for (let i = 0; i < 70; i++) {
        const res = await request(getApp().getHttpServer())
          .post('/api/notes')
          .send(VALID_NOTE);
        expect(res.status).toBe(201);
      }
    });
  });

  describe('with RATE_LIMIT_CREATE_MAX=0', () => {
    useCreateMax('0');

    afterAll(async () => {
      await disconnect();
    });

    it('fails to boot', async () => {
      await expect(buildApp()).rejects.toThrow(/RATE_LIMIT_CREATE_MAX/);
    });
  });
});
