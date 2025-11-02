import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Model } from 'mongoose';
import {
  UserDocument,
  UserSchema,
} from 'src/modules/users/infrastructure/schemas/user.schema';
import { PasswordService } from '../services/password.service';
import { JwtTokenService } from '../services/jwt-token.service';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { RegisterDTO } from '../dto/register.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { ERROR_MESSAGES } from 'src/core/constants/error-message.constant';
import { calculateAge, validateBirthDate } from 'src/shared/utils/utils.utils';
import { UserRole } from 'src/core/constants/roles.constant';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RegisterUseCase {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>,
    private passwordService: PasswordService,
    private jwtTokenService: JwtTokenService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    registerDTO: RegisterDTO,
    profileImage?: Express.Multer.File,
  ): Promise<AuthResponseDto> {
    if (registerDTO.password !== registerDTO.confirmPassword) {
      throw new BadRequestException(ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH);
    }

    validateBirthDate(new Date(registerDTO.birthDate));

    const existUser = await this.userModel.findOne({
      $or: [
        {
          email: registerDTO.email,
          username: registerDTO.username,
        },
      ],
    });

    if (existUser) {
      if (existUser?.email === registerDTO.email) {
        throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      if (existUser.username === registerDTO.username) {
        throw new ConflictException(ERROR_MESSAGES.USERNAME_ALREADY_EXISTS);
      }
    }

    const hashPassword = await this.passwordService.hashPassword(
      registerDTO.password,
    );

    let imageUrl: string | undefined;
    if (profileImage) {
      imageUrl = await this.cloudinaryService.uploadImage(profileImage);
    }

    const newUser = new this.userModel({
      email: registerDTO.email.toLowerCase(),
      username: registerDTO.username,
      password: hashPassword,
      firstName: registerDTO.firstName,
      lastName: registerDTO.lastName,
      birthDate: new Date(registerDTO.birthDate),
      bio: registerDTO.bio || '',
      profileImage: imageUrl,
      role: registerDTO.role || UserRole.USER,
      martialArts: [],
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      isActive: true,
      isVerified: false,
    });

    const savedUser = await newUser.save();
    const payload = {
      sub: savedUser._id.toString(),
      email: savedUser.email,
      username: savedUser.username,
      role: savedUser.role,
    };

    const token = await this.jwtTokenService.generateToken(payload);
    const refreshToken =
      await this.jwtTokenService.generateRefreshToken(payload);

    const userRes = {
      id: savedUser._id.toString(),
      email: savedUser.email,
      username: savedUser.username,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      fullName: `${savedUser.firstName} ${savedUser.lastName}`,
      birthDate: savedUser.birthDate,
      age: calculateAge(savedUser.birthDate),
      bio: savedUser.bio,
      profileImage: savedUser.profileImage,
      role: savedUser.role,
      principalMartialArt: savedUser.principalMartialArt,
      principalMartialLevel: savedUser.principalMartialLevel,
      principalBeltLevel: savedUser.principalBeltLevel,
      fighterLevel: savedUser.fighterLevel,
      martialArts: savedUser.martialArts.map((m) => ({
        martialArt: m.martialArt,
        martialLevel: m.level,
        beltLevel: m.beltLevel,
        yearsPractice: m.yearPractice,
      })),
      socialLinks: savedUser.socialLinks,
      followersCount: savedUser.followersCount,
      followingCount: savedUser.followingCount,
      postsCount: savedUser.postsCount,
      isActive: savedUser.isActive,
      isVerified: savedUser.isVerified,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    return {
      token,
      refreshToken,
      user: userRes,
      expiresIn: this.jwtTokenService.getTokenExpirationTime(),
    };
  }
}
