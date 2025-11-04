import { UserResponseDto } from '../../../../modules/users/application/dto/user-response-dto';
import { User } from '../../../../modules/users/domain/entities/user.entity';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName, // Se usa el getter de la entidad
      birthDate: user.birthDate,
      age: user.age, // Se usa el getter de la entidad
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
