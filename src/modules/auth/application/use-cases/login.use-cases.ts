import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordService } from '../services/password.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { ERROR_MESSAGES } from '../../../../core/constants/error-message.constant';
import { UserRepository } from '../../../../modules/users/infrastructure/repositories/user.repository';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmailOrUsername(
      loginDto.emailOrUsername,
    );

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }
    if (!user.isActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_DISABLED);
    }

    const passwordValid = await this.passwordService.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!passwordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const token = await this.jwtTokenService.generateToken(payload);
    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(payload);

    const userRes = UserMapper.toResponseDto(user);

    return {
      token,
      refreshToken,
      user: userRes,
      expiresIn: this.jwtTokenService.getTokenExpirationTime(),
    };
  }
}
