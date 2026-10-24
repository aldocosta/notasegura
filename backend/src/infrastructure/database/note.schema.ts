import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ timestamps: true })
export class NoteDocument extends Document {
  @Prop({ required: true }) ciphertext: string;
  @Prop({ required: true }) iv: string;
  @Prop({ required: true }) tag: string;
  @Prop() salt?: string;
  @Prop({ required: true, index: { expires: 0 } }) expiresAt: Date;
  @Prop({ required: true }) maxViews: number;
  @Prop({ default: 0 }) views: number;
}
export const NoteSchema = SchemaFactory.createForClass(NoteDocument);
