import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentRepository } from '../../../../../modules/publications/infrastructure/repositories/comment.repository';
import { PostRepository } from '../../../../../modules/publications/infrastructure/repositories/post.repository';
import {
  UserDocument,
  UserSchema,
} from '../../../../../modules/users/infrastructure/schemas/user.schema';
import { CreateCommentDto } from '../../dto/create-comment.dto';
import { CommentResponseDto } from '../../dto/comment-response.dto';
import { ERROR_MESSAGES } from '../../../../../core/constants/error-message.constant';

@Injectable()
export class CreateCommentUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly commentRepo: CommentRepository,
    @InjectModel(UserSchema.name)
    private userModel: Model<UserDocument>,
  ) {}

  async execute(
    postId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    const post = await this.postRepo.findById(postId);
    if (!post) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND_POST);

    // Crear comentario
    const comment = await this.commentRepo.create({
      postId,
      authorId: userId,
      content: createCommentDto.content,
      isModified: false,
      isActive: true,
    });

    await this.postRepo.incrementComments(postId);

    const author = await this.userModel.findById(userId);
    if (!author) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    return {
      id: comment.id,
      postId: comment.postId,
      author: {
        id: author._id.toString(),
        username: author.username,
        firstName: author.firstName,
        lastName: author.lastName,
        profileImage: author.profileImage,
      },
      content: comment.content,
      isModified: comment.isModified,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
