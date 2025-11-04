import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary-module.module';
import {
  UserSchema,
  UserSchemaFactory,
} from '../users/infrastructure/schemas/user.schema';
import { JwtConfigRootModule } from '../../config/jwt-config.module';
import {
  FollowSchema,
  FollowSchemaFactory,
} from '../users/infrastructure/schemas/follow.schema';
import {
  BlockSchema,
  BlockSchemaFactory,
} from '../users/infrastructure/schemas/block.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
      { name: FollowSchema.name, schema: FollowSchemaFactory },
      { name: BlockSchema.name, schema: BlockSchemaFactory },
    ]),
    JwtConfigRootModule,
    CloudinaryModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class PublicationsModule {}
