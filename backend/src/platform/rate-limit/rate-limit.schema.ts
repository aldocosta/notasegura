import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RATE_LIMIT_COLLECTION_NAME } from './rate-limit.constants';

@Schema({ collection: RATE_LIMIT_COLLECTION_NAME })
export class RateLimitDocument extends Document {
  @Prop({ required: true }) ip: string;
  @Prop({ required: true }) endpoint: string;
  @Prop({ required: true }) windowStart: Date;
  @Prop({ required: true }) count: number;
  @Prop({ required: true, index: { expires: 0 } }) expiresAt: Date;
}

export const RateLimitSchema = SchemaFactory.createForClass(RateLimitDocument);
RateLimitSchema.index({ ip: 1, endpoint: 1, windowStart: 1 }, { unique: true });
