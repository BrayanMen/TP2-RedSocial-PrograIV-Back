import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { ERROR_MESSAGES } from 'src/core/constants/error-message.constant';
import { UpdateProfileDto } from '../dto/user-profile-update.dto';
import { UserResponseDto } from '../dto/user-response-dto';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from 'src/modules/auth/application/mappers/user.mapper';

@Injectable()
export class UpdateUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(
    id: string,
    profileDto: UpdateProfileDto,
    profileImage?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    let imageUrl = user.profileImage;
    let imagePublicId = user.profileImagePublicId;

    if (profileImage) {
      // Si ya existe una imagen, bórrala usando el public_id
      if (imagePublicId) {
        await this.cloudinaryService.deleteImage(imagePublicId);
      }

      // Sube la nueva imagen y obtén la URL y el public_id
      const imageUpload =
        await this.cloudinaryService.uploadImage(profileImage);
      imageUrl = imageUpload.secure_url;
      imagePublicId = imageUpload.public_id;
    }

    const updateData: Partial<User> = {
      ...profileDto,
      profileImage: imageUrl,
      profileImagePublicId: imagePublicId,
    };

    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return UserMapper.toResponseDto(updatedUser);
  }
}
