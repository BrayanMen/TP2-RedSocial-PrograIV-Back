import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

import { UserResponseDto } from '../dto/user-response-dto';
import { ERROR_MESSAGES } from 'src/core/constants/error-message.constant';
import { UserMapper } from 'src/modules/auth/application/mappers/user.mapper';

@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return UserMapper.toResponseDto(user);
  }
}
