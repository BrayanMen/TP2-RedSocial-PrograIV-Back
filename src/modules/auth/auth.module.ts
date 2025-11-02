import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary-module.module';
import {
  UserSchema,
  UserSchemaFactory,
} from '../users/infrastructure/schemas/user.schema';
import { JwtConfigRootModule } from 'src/config/jwt-config.module';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { JwtTokenService } from './application/services/jwt-token.service';
import { PasswordService } from './application/services/password.service';
import { RegisterUseCase } from './application/use-cases/register.use-cases';
import { LoginUseCase } from './application/use-cases/login.use-cases';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
    ]),
    JwtConfigRootModule,
    CloudinaryModule,
  ],
  controllers: [AuthController],
  providers: [RegisterUseCase, LoginUseCase, PasswordService, JwtTokenService],
  exports: [JwtTokenService, PasswordService],
})
export class AuthModule {}
