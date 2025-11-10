export class Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: Date;

  constructor(partial: Partial<Like>) {
    Object.assign(this, partial);
  }
}
