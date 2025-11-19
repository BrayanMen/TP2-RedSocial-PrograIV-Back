import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserResponseDto } from '../dto/user-response-dto';
import { ERROR_MESSAGES } from 'src/core/constants/error-message.constant';
import { UserMapper } from 'src/modules/auth/application/mappers/user.mapper';

@Injectable()
export class DisableUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}
  async execute(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    if (!user.isActive) return UserMapper.toResponseDto(user);

    const disableUser = await this.userRepo.update(userId, {
      isActive: false,
    });

    if (!disableUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return UserMapper.toResponseDto(disableUser);
  }
}
