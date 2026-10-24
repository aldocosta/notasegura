export interface NoteProps {
  id?: string;
  ciphertext: string;
  iv: string;
  tag: string;
  salt?: string;
  expiresAt: Date;
  maxViews: number;
  views?: number;
  createdAt?: Date;
}
export class Note {
  id?: string;
  ciphertext: string;
  iv: string;
  tag: string;
  salt?: string;
  expiresAt: Date;
  maxViews: number;
  views: number;
  createdAt: Date;
  constructor(p: NoteProps) {
    this.id = p.id;
    this.ciphertext = p.ciphertext;
    this.iv = p.iv;
    this.tag = p.tag;
    this.salt = p.salt;
    this.expiresAt = p.expiresAt;
    this.maxViews = p.maxViews;
    this.views = p.views ?? 0;
    this.createdAt = p.createdAt ?? new Date();
  }
  isExpired(now = new Date()) {
    return now > this.expiresAt || this.views >= this.maxViews;
  }
  consumeView() {
    this.views += 1;
  }
}
