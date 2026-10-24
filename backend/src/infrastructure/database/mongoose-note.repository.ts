import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from '../../domain/note.entity';
import { NoteRepository } from '../../application/repositories/note.repository';
import { NoteDocument } from './note.schema';
@Injectable()
export class MongooseNoteRepository extends NoteRepository {
  constructor(
    @InjectModel(NoteDocument.name) private readonly model: Model<NoteDocument>,
  ) {
    super();
  }
  async create(note: Note): Promise<Note> {
    const doc = await this.model.create({
      ciphertext: note.ciphertext,
      iv: note.iv,
      tag: note.tag,
      salt: note.salt,
      expiresAt: note.expiresAt,
      maxViews: note.maxViews,
      views: note.views,
    });
    note.id = doc._id.toString();
    return note;
  }
  async findById(id: string): Promise<Note | null> {
    const doc = await this.model.findById(id).exec();
    if (!doc) return null;
    return new Note({
      id: doc._id.toString(),
      ciphertext: doc.ciphertext,
      iv: doc.iv,
      tag: doc.tag,
      salt: doc.salt,
      expiresAt: doc.expiresAt,
      maxViews: doc.maxViews,
      views: doc.views,
      createdAt: (doc as { createdAt?: Date }).createdAt,
    });
  }
  async update(note: Note): Promise<Note> {
    await this.model.findByIdAndUpdate(note.id, { views: note.views }).exec();
    return note;
  }
}
