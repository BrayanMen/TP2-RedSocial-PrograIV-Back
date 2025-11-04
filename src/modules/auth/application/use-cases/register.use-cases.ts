import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PasswordService } from '../services/password.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { RegisterDTO } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { ERROR_MESSAGES } from 'src/core/constants/error-message.constant';
import { validateBirthDate } from 'src/shared/utils/utils.utils';
import { UserRole } from 'src/core/constants/roles.constant';
import { UserRepository } from 'src/modules/users/infrastructure/repositories/user.repository';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    registerDTO: RegisterDTO,
    profileImage?: Express.Multer.File,
  ): Promise<AuthResponseDto> {
    if (registerDTO.password !== registerDTO.confirmPassword) {
      throw new BadRequestException(ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH);
    }

    validateBirthDate(new Date(registerDTO.birthDate));

    const emailExists = await this.userRepository.findByEmail(
      registerDTO.email,
    );
    if (emailExists) {
      throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const usernameExists = await this.userRepository.findByUsername(
      registerDTO.username,
    );
    if (usernameExists) {
      throw new ConflictException(ERROR_MESSAGES.USERNAME_ALREADY_EXISTS);
    }

    const hashPassword = await this.passwordService.hashPassword(
      registerDTO.password,
    );

    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (profileImage) {
      const upload = await this.cloudinaryService.uploadImage(profileImage);
      imageUrl = upload.secure_url;
      imagePublicId = upload.public_id;
    }

    const newUserPayload: Partial<User> = {
      email: registerDTO.email.toLowerCase(),
      username: registerDTO.username,
      password: hashPassword,
      firstName: registerDTO.firstName,
      lastName: registerDTO.lastName,
      birthDate: new Date(registerDTO.birthDate),
      bio: registerDTO.bio || '',
      profileImage: imageUrl,
      profileImagePublicId: imagePublicId,
      role: registerDTO.role || UserRole.USER,
      martialArts: [],
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      isActive: true,
      isVerified: false,
    };

    const savedUser = await this.userRepository.create(newUserPayload);

    const payload = {
      sub: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      role: savedUser.role,
    };

    const token = await this.jwtTokenService.generateToken(payload);
    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(payload);

    const userRes = UserMapper.toResponseDto(savedUser);

    return {
      token,
      refreshToken,
      user: userRes,
      expiresIn: this.jwtTokenService.getTokenExpirationTime(),
    };
  }
}
