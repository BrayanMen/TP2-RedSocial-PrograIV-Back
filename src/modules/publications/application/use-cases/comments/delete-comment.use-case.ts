import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  UserDocument,
  UserSchema,
} from '../../../../../modules/users/infrastructure/schemas/user.schema';
import { UserRole } from '../../../../../core/constants/roles.constant';
import { ERROR_MESSAGES } from '../../../../../core/constants/error-message.constant';
import { CommentRepository } from '../../../../../modules/publications/infrastructure/repositories/comment.repository';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly commentRepo: CommentRepository,
    @InjectModel(UserSchema.name)
    private userModel: Model<UserDocument>,
  ) {}

  async execute(
    commentId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<void> {
    const comment = await this.commentRepo.findById(commentId);

    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND_COMMENT);
    }

    const isAuthor = comment.authorId === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    await this.commentRepo.delete(commentId);

    await this.userModel.findByIdAndUpdate(comment.authorId, {
      $inc: { postsCount: -1 },
    });
  }
}
