import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../../../../core/constants/roles.constant';
import { ERROR_MESSAGES } from '../../../../../core/constants/error-message.constant';
import { CommentRepository } from '../../../../../modules/publications/infrastructure/repositories/comment.repository';
import { PostRepository } from '../../../../../modules/publications/infrastructure/repositories/post.repository';

@Injectable()
export class DeleteCommentUseCase {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly postRepo: PostRepository,
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
    await this.postRepo.decrementComments(comment.postId); // Corregido a comment.postId
  }
}
