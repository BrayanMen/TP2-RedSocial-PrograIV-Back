import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PostType } from '../../domain/enums/post-type.enum';
import { HydratedDocument } from 'mongoose';

export type PostDocument = HydratedDocument<PostSchema>;

@Schema({ timestamps: true })
export class PostSchema {
  @Prop({
    type: Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  authorId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  image?: string;
  @Prop()
  imagePublicId?: string;

  @Prop({ type: String, enum: PostType, default: PostType.GENERAL })
  type: PostType;

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0 })
  commentsCount: number;

  @Prop({ default: 0 })
  repostsCount: number;

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const PostSchemaFactory = SchemaFactory.createForClass(PostSchema);

// Índices para mejorar performance
PostSchemaFactory.index({ authorId: 1, createdAt: -1 });
PostSchemaFactory.index({ isActive: 1, createdAt: -1 });
PostSchemaFactory.index({ isActive: 1, likesCount: -1 });
