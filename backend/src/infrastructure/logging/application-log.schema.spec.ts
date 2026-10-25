import mongoose from 'mongoose';
import { ApplicationLogSchema } from './application-log.schema';

describe('application-log schema', () => {
  it('has TTL index', async () => {
    const conn = mongoose.createConnection('mongodb://eticador:eticador_homolog@localhost:27017/safenote?authSource=admin');
    await conn.asPromise();
    const model = conn.model('ApplicationLog', ApplicationLogSchema, 'application_logs');
    await model.syncIndexes();
    const indexes = await model.collection.listIndexes().toArray();
    const ttl = indexes.find((i: any) => i.key?.occurredAt === 1);
    expect(ttl).toBeDefined();
    expect(ttl.expireAfterSeconds).toBe(7776000);
    await conn.close();
  }, 30000);
});