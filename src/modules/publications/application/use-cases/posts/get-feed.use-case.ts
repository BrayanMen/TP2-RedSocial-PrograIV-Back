import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostRepository } from '../../../infrastructure/repositories/post.repository';
import { LikeRepository } from '../../../infrastructure/repositories/like.repository';
import {
  UserDocument,
  UserSchema,
} from '../../../../../modules/users/infrastructure/schemas/user.schema';
import { PostSortBy } from '../../../domain/enums/post-sort.enum';
import { IPaginateRes } from '../../../../../core/interface/IPaginated.interface';
import { PostResponseDto } from '../../dto/post-response.dto';
import { RepostRepository } from '../../../infrastructure/repositories/repost.repository';

@Injectable()
export class GetFeedCaseUse {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly likeRepo: LikeRepository,
    private readonly repostRepo: RepostRepository,
    @InjectModel(UserSchema.name)
    private userModel: Model<UserDocument>,
  ) {}

  async execute(
    userId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: PostSortBy = PostSortBy.DATE,
    filterByUserId?: string,
  ): Promise<IPaginateRes<PostResponseDto>> {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.postRepo.findAll(skip, limit, sortBy, filterByUserId),
      this.postRepo.countPost(filterByUserId),
    ]);

    const postIds = posts.map((p) => p.id);

    const [likedPostIds, repostedPostIds] = await Promise.all([
      this.likeRepo.findPostsById(postIds, userId),
      this.repostRepo.findPostsIds(postIds, userId),
    ]);

    const authorIds = [...new Set(posts.map((p) => p.authorId))];
    const authors = await this.userModel.find({ _id: { $in: authorIds } });
    const authorsMap = new Map(authors.map((a) => [a._id.toString(), a]));

    const postsDto: PostResponseDto[] = posts.map((p) => {
      const author = authorsMap.get(p.authorId);
      return {
        id: p.id,
        author: {
          id: author?._id.toString() || '',
          username: author?.username || '',
          firstName: author?.firstName || '',
          lastName: author?.lastName || '',
          profileImage: author?.profileImage || '',
        },
        title: p.title,
        content: p.content,
        image: p.image,
        type: p.type,
        likesCount: p.likesCount,
        commentsCount: p.commentsCount,
        repostsCount: p.repostsCount,
        isLikedByMe: likedPostIds.includes(p.id),
        isRepostedByMe: repostedPostIds.includes(p.id),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    return {
      data: postsDto,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        nextPage: page * limit < total,
        prevPage: page > 1,
      },
    };
  }
}
