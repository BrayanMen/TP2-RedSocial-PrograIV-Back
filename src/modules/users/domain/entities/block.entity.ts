export class Block {
  id: string;
  blockerId: string;
  blockedId: string;
  reason?: string;
  createdAt: Date;

  constructor(partial: Partial<Block>) {
    Object.assign(this, partial);
  }
}
