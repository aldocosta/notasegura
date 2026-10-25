import { Note } from './note.entity';
export abstract class NoteRepository {
  abstract create(note: Note): Promise<Note>;
  abstract findById(id: string): Promise<Note | null>;
  abstract update(note: Note): Promise<Note>;
}
