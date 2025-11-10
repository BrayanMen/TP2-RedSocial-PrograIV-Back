import { PostType } from '../enums/post-type.enum';

export class Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  image?: string;
  imagePublicId?: string;
  type: PostType;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }

  incrementLikes(): void {
    this.likesCount++;
  }

  decrementLikes(): void {
    if (this.likesCount > 0) {
      this.likesCount--;
    }
  }

  incrementComments(): void {
    this.commentsCount++;
  }

  decrementComments(): void {
    if (this.commentsCount > 0) {
      this.commentsCount--;
    }
  }

  incrementReposts(): void {
    this.repostsCount++;
  }

  decrementReposts(): void {
    if (this.repostsCount > 0) {
      this.repostsCount--;
    }
  }

  softDelete(): void {
    this.isActive = false;
  }

  restore(): void {
    this.isActive = true;
  }
}
