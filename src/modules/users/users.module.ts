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
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary-module.module';
import { UsersController } from './infrastructure/controllers/users.controller';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { JwtConfigRootModule } from '../../config/jwt-config.module';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { GetAllUsersUseCase } from './application/use-cases/get-all-users.use-case';
import { GetUserProfileUseCase } from './application/use-cases/get-user-profile.use-case';
import { UpdateUserProfileUseCase } from './application/use-cases/update-user-profile.use-case';

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
  providers: [
    UserRepository,
    AuthGuard,
    RolesGuard,
    GetAllUsersUseCase,
    GetUserProfileUseCase,
    UpdateUserProfileUseCase,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
