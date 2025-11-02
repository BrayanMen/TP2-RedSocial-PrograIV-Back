import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type FollowDocument = FollowSchema & Document;

@Schema({ timestamps: true })
export class FollowSchema {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  followerId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  followedId: MongooseSchema.Types.ObjectId;
}

export const FollowSchemaFactory = SchemaFactory.createForClass(FollowSchema);

FollowSchemaFactory.index({ followerId: 1, followedId: 1 }, { unique: true });
