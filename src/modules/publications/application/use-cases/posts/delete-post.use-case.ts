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
import { PostRepository } from '../../../infrastructure/repositories/post.repository';
import { UserRole } from '../../../../../core/constants/roles.constant';
import { ERROR_MESSAGES } from '../../../../../core/constants/error-message.constant';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    @InjectModel(UserSchema.name)
    private userModel: Model<UserDocument>,
  ) {}

  async execute(
    postId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<void> {
    const post = await this.postRepo.findById(postId);

    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND_POST);
    }

    const isAuthor = post.authorId === userId;
    const isAdmin = userRole === UserRole.ADMIN;

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
    }

    await this.postRepo.delete(postId);

    await this.userModel.findByIdAndUpdate(post.authorId, {
      $inc: { postsCount: -1 },
    });
  }
}
