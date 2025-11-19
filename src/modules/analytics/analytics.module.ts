import { Module } from '@nestjs/common';
import { AnalyticsController } from './infrastructure/controllers/analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PostSchema,
  PostSchemaFactory,
} from '../publications/infrastructure/schemas/post.schema';
import {
  UserSchema,
  UserSchemaFactory,
} from '../users/infrastructure/schemas/user.schema';
import { GetPostsPerUserUseCase } from './application/use-cases/get-posts-per-user.use-case';
import { GetCommentsByRangeUseCase } from './application/use-cases/get-comments-by-range.use-case';
import {
  CommentSchema,
  CommentSchemaFactory,
} from '../publications/infrastructure/schemas/comment.schema';
import { GetCommentsPerPostUseCase } from './application/use-cases/get-comments-per-post.use-case';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PostSchema.name, schema: PostSchemaFactory },
      { name: UserSchema.name, schema: UserSchemaFactory },
      { name: CommentSchema.name, schema: CommentSchemaFactory },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [
    JwtService,
    GetPostsPerUserUseCase,
    GetCommentsByRangeUseCase,
    GetCommentsPerPostUseCase,
  ],
  exports: [],
})
export class AnalyticsModule {}
