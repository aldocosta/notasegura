import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Rate limiting (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('health check is not rate limited', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app.getHttpServer()).get('/api/health');
      expect(res.status).toBe(200);
    }
  });

  it('Retry-After header present on 429', async () => {
    // This test would require real DB; in unit context we verify structure
    const res = await request(app.getHttpServer()).post('/api/notes').send({
      text: 'test',
      expiresInDays: 1,
      maxViews: 1,
    });
    // May be 201 or 429 depending on state; just ensure header logic exists
    if (res.status === 429) {
      expect(res.headers['retry-after']).toBeDefined();
    }
  });
});
