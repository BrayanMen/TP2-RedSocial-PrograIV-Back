import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPaginateRes } from '../../../../../core/interface/IPaginated.interface';
import { CommentRepository } from '../../../../../modules/publications/infrastructure/repositories/comment.repository';
import { PostRepository } from '../../../../../modules/publications/infrastructure/repositories/post.repository';
import {
  UserDocument,
  UserSchema,
} from '../../../../../modules/users/infrastructure/schemas/user.schema';
import { CommentResponseDto } from '../../dto/comment-response.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../../../../core/constants/error-message.constant';

@Injectable()
export class GetCommentsUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly commentRepo: CommentRepository,
    @InjectModel(UserSchema.name)
    private userModel: Model<UserDocument>,
  ) {}

  async execute(
    postId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginateRes<CommentResponseDto>> {
    const post = await this.postRepo.findById(postId);
    if (!post) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND_POST);

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.commentRepo.findByPostId(postId, skip, limit),
      this.commentRepo.countByPostId(postId),
    ]);

    const authorIds = [...new Set(comments.map((c) => c.authorId))];
    const authors = await this.userModel.find({ _id: { $in: authorIds } });
    const authorsMap = new Map(authors.map((a) => [a._id.toString(), a]));

    const commentsDto: CommentResponseDto[] = comments.map((c) => {
      const author = authorsMap.get(c.authorId);
      return {
        id: c.id,
        postId: c.postId,
        author: {
          id: author?._id.toString() || '',
          username: author?.username || '',
          firstName: author?.firstName || '',
          lastName: author?.lastName || '',
          profileImage: author?.profileImage || '',
        },
        content: c.content,
        isModified: c.isModified,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    return {
      data: commentsDto,
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
