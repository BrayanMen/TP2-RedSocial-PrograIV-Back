import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../../../../core/constants/error-message.constant';
import { LikeRepository } from '../../../infrastructure/repositories/like.repository';
import { PostRepository } from '../../../infrastructure/repositories/post.repository';

@Injectable()
export class DislikePostUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly likeRepo: LikeRepository,
  ) {}

  async execute(
    postId: string,
    userId: string,
  ): Promise<{ message: string; likesCount: number }> {
    const post = await this.postRepo.findById(postId);
    if (!post) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND_POST);

    const existLike = await this.likeRepo.findOne(userId, postId);
    if (!existLike) throw new NotFoundException(ERROR_MESSAGES.NOT_LIKE);

    await this.likeRepo.delete(userId, postId);

    await this.postRepo.decrementLikes(postId);

    return {
      message: 'Me gusta agregado',
      likesCount: Math.max(0, post.likesCount - 1),
    };
  }
}
