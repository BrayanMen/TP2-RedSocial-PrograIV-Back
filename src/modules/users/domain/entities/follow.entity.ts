export class Follow {
  id: string;
  followerId: string;
  followedId: string;
  createdAt: Date;

  constructor(partial: Partial<Follow>) {
    Object.assign(this, partial);
  }
}
