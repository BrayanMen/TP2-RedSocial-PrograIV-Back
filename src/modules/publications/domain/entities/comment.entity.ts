export class Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  isModified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Comment>) {
    Object.assign(this, partial);
  }

  asModified(): void {
    this.isModified = true;
  }

  softDelete(): void {
    this.isActive = false;
  }

  restore(): void {
    this.isActive = true;
  }
}
