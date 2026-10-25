import mongoose from 'mongoose';
import { ApplicationLogSchema } from './application-log.schema';

interface IndexDef {
  key?: Record<string, number>;
  expireAfterSeconds?: number;
}

describe('application-log schema', () => {
  it('has TTL index', async () => {
    const conn = mongoose.createConnection(
      'mongodb://localhost:27017/safenote',
    );
    await conn.asPromise();
    const model = conn.model(
      'ApplicationLog',
      ApplicationLogSchema,
      'application_logs',
    );
    await model.syncIndexes();
    const indexes = (await model.collection
      .listIndexes()
      .toArray()) as IndexDef[];
    const ttl = indexes.find((i) => i.key?.occurredAt === 1);
    expect(ttl).toBeDefined();
    expect(ttl?.expireAfterSeconds).toBe(7776000);
    await conn.close();
  }, 30000);
});
