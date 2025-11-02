import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dto/user-response-dto';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { ERROR_MESSAGES } from 'src/core/constants/error-message.constant';
import { UpdateProfileDto } from '../dto/user-profile-update.dto';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userRepository.findAll(skip, limit),
      this.userRepository.countUser(),
    ]);

    return {
      data: users.map((user) => this.toResponseDto(user)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getUserProfile(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    return this.toResponseDto(user);
  }

  async putUserProfile(
    id: string,
    profileDto: UpdateProfileDto,
    profileImage?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    let imageUrl = user.profileImage;

    if (profileImage) {
      if (imageUrl) {
        const publicId = this.cloudinaryService.getPublicId(imageUrl);
        await this.cloudinaryService.deleteImage(publicId);
      }

      const imageUpload =
        await this.cloudinaryService.uploadImage(profileImage);
      imageUrl = imageUpload;
    }

    const updateUser = await this.userRepository.update(id, {
      ...profileDto,
      profileImage: imageUrl,
    });
    if (!updateUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return this.toResponseDto(updateUser);
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      birthDate: user.birthDate,
      age: user.age,
      bio: user.bio,
      profileImage: user.profileImage,
      role: user.role,
      principalMartialArt: user.principalMartialArt,
      principalMartialLevel: user.principalMartialLevel,
      principalBeltLevel: user.principalBeltLevel,
      fighterLevel: user.fighterLevel,
      martialArts: user.martialArts.map((m) => ({
        martialArt: m.martialArt,
        martialLevel: m.martialLevel,
        beltLevel: m.beltLevel,
        yearsPractice: m.yearsPractice,
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
  }
}
