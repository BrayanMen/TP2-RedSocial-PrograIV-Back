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
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND_POST);
    }

    const existLike = await this.likeRepo.findOne(userId, postId);
    if (!existLike) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_LIKE);
    }

    await this.likeRepo.delete(userId, postId);

    const updateSuccess = await this.postRepo.decrementLikes(postId);

    if (!updateSuccess) {
      await this.likeRepo.create(userId, postId);
      throw new Error('Error al actualizar el contador de likes');
    }

    const updatedPost = await this.postRepo.findById(postId);

    return {
      message: 'Me gusta eliminado',
      likesCount: updatedPost?.likesCount || Math.max(0, post.likesCount - 1),
    };
  }
}
