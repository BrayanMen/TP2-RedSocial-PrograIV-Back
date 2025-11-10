import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<CommentSchema>;

@Schema({ timestamps: true })
export class CommentSchema {
  @Prop({
    type: Types.ObjectId,
    ref: 'PostSchema',
    required: true,
  })
  postId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  authorId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isModified: boolean;

  @Prop({ default: true })
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchemaFactory = SchemaFactory.createForClass(CommentSchema);

CommentSchemaFactory.index({ postId: 1, createdAt: -1 });
CommentSchemaFactory.index({ authorId: 1, createdAt: -1 });
