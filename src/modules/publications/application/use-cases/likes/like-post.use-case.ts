import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from '../../../../../core/constants/error-message.constant';
import { LikeRepository } from '../../../../../modules/publications/infrastructure/repositories/like.repository';
import { PostRepository } from '../../../../../modules/publications/infrastructure/repositories/post.repository';

@Injectable()
export class LikePostUseCase {
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
    if (existLike) throw new ConflictException(ERROR_MESSAGES.ALREADY_LIKE);

    await this.likeRepo.create(userId, postId);

    await this.postRepo.incrementComments(postId);

    return {
      message: 'Me gusta agregado',
      likesCount: post.likesCount + 1,
    };
  }
}
