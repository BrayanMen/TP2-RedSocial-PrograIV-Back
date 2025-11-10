import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary-module.module';
import {
  UserSchema,
  UserSchemaFactory,
} from '../users/infrastructure/schemas/user.schema';
import { JwtConfigRootModule } from '../../config/jwt-config.module';
import {
  PostSchema,
  PostSchemaFactory,
} from './infrastructure/schemas/post.schema';
import {
  LikeSchema,
  LikeSchemaFactory,
} from './infrastructure/schemas/like.schema';
import {
  CommentSchema,
  CommentSchemaFactory,
} from './infrastructure/schemas/comment.schema';
import {
  RepostSchema,
  RepostSchemaFactory,
} from './infrastructure/schemas/repost.schema';
import { PostsController } from './infrastructure/controllers/post.controller';
import { LikesController } from './infrastructure/controllers/likes.controller';
import { CommentsController } from './infrastructure/controllers/comments.controller';
import { PostRepository } from './infrastructure/repositories/post.repository';
import { LikeRepository } from './infrastructure/repositories/like.repository';
import { RepostRepository } from './infrastructure/repositories/repost.repository';
import { CommentRepository } from './infrastructure/repositories/comment.repository';
import { CreatePostUseCase } from './application/use-cases/posts/create-post.use-case';
import { GetFeedCaseUse } from './application/use-cases/posts/get-feed.use-case';
import { DeletePostUseCase } from './application/use-cases/posts/delete-post.use-case';
import { LikePostUseCase } from './application/use-cases/likes/like-post.use-case';
import { DislikePostUseCase } from './application/use-cases/likes/dislike-post.use-case';
import { GetCommentsUseCase } from './application/use-cases/comments/get-comment.use-case';
import { DeleteCommentUseCase } from './application/use-cases/comments/delete-comment.use-case';
import { UpdateCommentUseCase } from './application/use-cases/comments/update-comment.use-case';
import { CreateCommentUseCase } from './application/use-cases/comments/create-comment.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostSchema.name, schema: PostSchemaFactory },
      { name: LikeSchema.name, schema: LikeSchemaFactory },
      { name: CommentSchema.name, schema: CommentSchemaFactory },
      { name: RepostSchema.name, schema: RepostSchemaFactory },
      { name: UserSchema.name, schema: UserSchemaFactory },
    ]),
    JwtConfigRootModule,
    CloudinaryModule,
  ],
  controllers: [PostsController, LikesController, CommentsController],
  providers: [
    PostRepository,
    LikeRepository,
    RepostRepository,
    CommentRepository,

    CreatePostUseCase,
    GetFeedCaseUse,
    DeletePostUseCase,

    LikePostUseCase,
    DislikePostUseCase,

    CreateCommentUseCase,
    GetCommentsUseCase,
    UpdateCommentUseCase,
    DeleteCommentUseCase,
  ],
  exports: [
    PostRepository,
    LikeRepository,
    RepostRepository,
    CommentRepository,
  ],
})
export class PublicationsModule {}
