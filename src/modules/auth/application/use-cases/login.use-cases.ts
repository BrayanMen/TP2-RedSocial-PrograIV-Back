import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserDocument,
  UserSchema,
} from 'src/modules/users/infrastructure/schemas/user.schema';
import { PasswordService } from '../services/password.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { Model } from 'mongoose';
import { ERROR_MESSAGES } from 'src/core/constants/error-message.constant';
import { calculateAge } from 'src/shared/utils/utils.utils';

@Injectable()
export class LoginUseCase {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>,
    private passwordService: PasswordService,
    private jwtTokenService: JwtTokenService,
  ) {}

  async execute(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userModel.findOne({
      $or: [
        { email: loginDto.emailOrUsername.toLowerCase() },
        { username: loginDto.emailOrUsername },
      ],
    });

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
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const token = await this.jwtTokenService.generateToken(payload);
    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(payload);

    const userRes = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      birthDate: user.birthDate,
      age: calculateAge(user.birthDate),
      bio: user.bio,
      profileImage: user.profileImage,
      role: user.role,
      principalMartialArt: user.principalMartialArt,
      principalMartialLevel: user.principalMartialLevel,
      principalBeltLevel: user.principalBeltLevel,
      fighterLevel: user.fighterLevel,
      martialArts: user.martialArts.map((m) => ({
        martialArt: m.martialArt,
        martialLevel: m.level,
        beltLevel: m.beltLevel,
        yearsPractice: m.yearPractice,
      })),
      socialLinks: user.socialLinks,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      token,
      refreshToken,
      user: userRes,
      expiresIn: this.jwtTokenService.getTokenExpirationTime(),
    };
  }
}
