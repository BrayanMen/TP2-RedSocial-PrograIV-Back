import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserSchema,
  UserSchemaFactory,
} from './infrastructure/schemas/user.schema';
import {
  FollowSchema,
  FollowSchemaFactory,
} from './infrastructure/schemas/follow.schema';
import {
  BlockSchema,
  BlockSchemaFactory,
} from './infrastructure/schemas/block.schema';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary-module.module';
import { UsersController } from './infrastructure/controllers/users.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserService } from './application/services/users.service';
import { JwtConfigRootModule } from 'src/config/jwt-config.module';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
      { name: FollowSchema.name, schema: FollowSchemaFactory },
      { name: BlockSchema.name, schema: BlockSchemaFactory },
    ]),
    CloudinaryModule,
    JwtConfigRootModule,
  ],
  controllers: [UsersController],
  providers: [UserService, UserRepository, AuthGuard, RolesGuard],
  exports: [UserService, UserRepository],
})
export class UsersModule {}
