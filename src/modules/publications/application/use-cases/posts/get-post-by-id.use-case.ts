import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../../infrastructure/repositories/post.repository';
import { LikeRepository } from '../../../infrastructure/repositories/like.repository';
import { PostResponseDto } from '../../dto/post-response.dto';
import { RepostRepository } from '../../../infrastructure/repositories/repost.repository';
import { UserRepository } from 'src/modules/users/infrastructure/repositories/user.repository';
import { ERROR_MESSAGES } from 'src/core/constants/error-message.constant';

@Injectable()
export class GetPostByIdUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly likeRepo: LikeRepository,
    private readonly repostRepo: RepostRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string, postId: string): Promise<PostResponseDto> {
    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND_POST);
    }

    const [author, isLike, isRepost] = await Promise.all([
      this.userRepo.findById(post.authorId),
      this.likeRepo.existsByUserAndPost(userId, postId),
      this.repostRepo.existsByUserAndPost(userId, postId),
    ]);

    if (!author) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const postsDto: PostResponseDto = {
      id: post.id,
      author: {
        id: author?.id,
        username: author?.username,
        firstName: author?.firstName,
        lastName: author?.lastName,
        profileImage: author?.profileImage,
      },
      title: post.title,
      content: post.content,
      image: post.image,
      type: post.type,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      repostsCount: post.repostsCount,
      isLikedByMe: isLike,
      isRepostedByMe: isRepost,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return postsDto;
  }
}
