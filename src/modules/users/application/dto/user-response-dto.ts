import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MartialArt } from '../../domain/enums/martial-art.enum';
import {
  BeltLevel,
  FighterLevel,
  MartialLevel,
} from '../../domain/enums/martial-level.enum';
import { UserRole } from '../../../../core/constants/roles.constant';

export class MartialArtInfoResponseDto {
  @ApiProperty({ enum: MartialArt })
  martialArt: MartialArt;

  @ApiProperty({ enum: MartialLevel })
  martialLevel: MartialLevel;

  @ApiPropertyOptional({ enum: BeltLevel })
  beltLevel?: BeltLevel;

  @ApiPropertyOptional()
  yearsPractice?: number;
}

export class SocialLinksResponseDto {
  @ApiPropertyOptional()
  instagram?: string;

  @ApiPropertyOptional()
  facebook?: string;

  @ApiPropertyOptional()
  youtube?: string;

  @ApiPropertyOptional()
  tiktok?: string;

  @ApiPropertyOptional()
  website?: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  birthDate: Date;

  @ApiProperty()
  age: number;

  @ApiProperty()
  bio: string;

  @ApiPropertyOptional()
  profileImage?: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiPropertyOptional({ enum: MartialArt })
  principalMartialArt?: MartialArt;

  @ApiPropertyOptional({ enum: MartialLevel })
  principalMartialLevel?: MartialLevel;

  @ApiPropertyOptional({ enum: BeltLevel })
  principalBeltLevel?: BeltLevel;

  @ApiPropertyOptional({ enum: FighterLevel })
  fighterLevel?: FighterLevel;

  @ApiProperty({ type: [MartialArtInfoResponseDto] })
  martialArts: MartialArtInfoResponseDto[];

  @ApiPropertyOptional({ type: SocialLinksResponseDto })
  socialLinks?: SocialLinksResponseDto;

  @ApiProperty()
  followersCount: number;

  @ApiProperty()
  followingCount: number;

  @ApiProperty()
  postsCount: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
