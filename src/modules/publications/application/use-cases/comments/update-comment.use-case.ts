import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentRepository } from '../../../../../modules/publications/infrastructure/repositories/comment.repository';
import {
  UserDocument,
  UserSchema,
} from '../../../../../modules/users/infrastructure/schemas/user.schema';
import { UpdateCommentDto } from '../../dto/update-comment.dto';
import { CommentResponseDto } from '../../dto/comment-response.dto';
import { ERROR_MESSAGES } from '../../../../../core/constants/error-message.constant';

@Injectable()
export class UpdateCommentUseCase {
  constructor(
    private readonly commentRepo: CommentRepository,
    @InjectModel(UserSchema.name)
    private userModel: Model<UserDocument>,
  ) {}

  async execute(
    commentId: string,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.commentRepo.findById(commentId);
    if (!comment) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND_COMMENT);

    if (comment.authorId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    const updated = await this.commentRepo.update(
      commentId,
      updateCommentDto.content,
    );
    if (!updated) {
      throw new NotFoundException(ERROR_MESSAGES.COMMENT_COULD_NOT_UPDATED);
    }

    const author = await this.userModel.findById(userId);
    if (!author) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    return {
      id: updated.id,
      postId: updated.postId,
      author: {
        id: author._id.toString(),
        username: author.username,
        firstName: author.firstName,
        lastName: author.lastName,
        profileImage: author.profileImage,
      },
      content: updated.content,
      isModified: updated.isModified,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
