import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BlockDocument = BlockSchema & Document;

@Schema({ timestamps: true })
export class BlockSchema {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  blockerId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  blockedId: MongooseSchema.Types.ObjectId;

  @Prop()
  reason?: string;
}

export const BlockSchemaFactory = SchemaFactory.createForClass(BlockSchema);

BlockSchemaFactory.index({ blockerId: 1, blockedId: 1 }, { unique: true });
