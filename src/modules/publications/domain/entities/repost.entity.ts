export class Repost {
  id: string;
  userId: string;
  postId: string;
  originalAuthorId: string;
  comment?: string;
  createdAt: Date;

  constructor(partial: Partial<Repost>) {
    Object.assign(this, partial);
  }
}
