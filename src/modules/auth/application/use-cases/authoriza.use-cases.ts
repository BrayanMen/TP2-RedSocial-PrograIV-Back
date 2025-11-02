import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from '../services/jwt-token.service';
import { UserRepository } from 'src/modules/users/infrastructure/repositories/user.repository';
import { ERROR_MESSAGES } from 'src/core/constants/error-message.constant';

@Injectable()
export class AuthorizaUseCase {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(token: string) {
    try {
      const payload = await this.jwtTokenService.verifyToken(token);
      const user = await this.userRepository.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
      }
      return {
        userId: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
    } catch {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_TOKEN);
    }
  }
}
