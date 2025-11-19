import { PasswordService } from 'src/modules/auth/application/services/password.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { CreateUserByAdminDto } from '../dto/create-user-by-admin.dto';
import { UserResponseDto } from '../dto/user-response-dto';
import { validateBirthDate } from 'src/shared/utils/utils.utils';
import { ConflictException, Injectable } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/core/constants/error-message.constant';
import { User } from '../../domain/entities/user.entity';
import { UserMapper } from 'src/modules/auth/application/mappers/user.mapper';

@Injectable() // Añadir este decorador
export class CreateUserByAdminUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(createUserDto: CreateUserByAdminDto): Promise<UserResponseDto> {
    if (createUserDto.birthDate) {
      validateBirthDate(new Date(createUserDto.birthDate));
    }

    const emailExists = await this.userRepo.findByEmail(createUserDto.email);
    if (emailExists) {
      throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const usernameExists = await this.userRepo.findByUsername(
      createUserDto.username,
    );
    if (usernameExists) {
      throw new ConflictException(ERROR_MESSAGES.USERNAME_ALREADY_EXISTS);
    }
    const hashPassword = await this.passwordService.hashPassword(
      createUserDto.password,
    );
    const newUserByAdmin: Partial<User> = {
      email: createUserDto.email.toLowerCase(),
      username: createUserDto.username,
      password: hashPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      birthDate: createUserDto.birthDate
        ? new Date(createUserDto.birthDate)
        : undefined,
      bio: createUserDto.bio || '',
      role: createUserDto.role,
      martialArts: [],
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      isActive: true,
      isVerified: false,
    };
    const saveUser = await this.userRepo.create(newUserByAdmin);
    return UserMapper.toResponseDto(saveUser);
  }
}
