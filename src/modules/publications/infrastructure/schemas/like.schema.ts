import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LikeDocument = HydratedDocument<LikeSchema>;

@Schema({ timestamps: true })
export class LikeSchema {
  @Prop({
    type: Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'PostSchema',
    required: true,
  })
  postId: Types.ObjectId;

  createdAt: Date;
}

export const LikeSchemaFactory = SchemaFactory.createForClass(LikeSchema);

LikeSchemaFactory.index({ userId: 1, postId: 1 }, { unique: true });
