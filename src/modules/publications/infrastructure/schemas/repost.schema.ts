import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RepostDocument = HydratedDocument<RepostSchema>;

@Schema({ timestamps: true })
export class RepostSchema {
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

  @Prop({
    type: Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  originalAuthorId: Types.ObjectId;

  @Prop()
  comment?: string;

  createdAt: Date;
}

export const RepostSchemaFactory = SchemaFactory.createForClass(RepostSchema);

RepostSchemaFactory.index({ userId: 1, postId: 1 }, { unique: true }); //Un solo repost por usuario
