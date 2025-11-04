import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../../shared/cloudinary/cloudinary-module.module';
import { JwtConfigRootModule } from '../../config/jwt-config.module';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { JwtTokenService } from './application/services/jwt-token.service';
import { PasswordService } from './application/services/password.service';
import { RegisterUseCase } from './application/use-cases/register.use-cases';
import { LoginUseCase } from './application/use-cases/login.use-cases';
import { RefreshTokenUseCases } from './application/use-cases/refresh-token.use-cases';
import { AuthorizaUseCase } from './application/use-cases/authoriza.use-cases';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, JwtConfigRootModule, CloudinaryModule],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCases,
    AuthorizaUseCase,
    PasswordService,
    JwtTokenService,
  ],
  exports: [JwtTokenService, PasswordService],
})
export class AuthModule {}
