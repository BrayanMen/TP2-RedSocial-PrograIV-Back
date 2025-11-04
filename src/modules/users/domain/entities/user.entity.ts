import { UserRole } from 'src/core/constants/roles.constant';
import { MartialArt } from '../enums/martial-art.enum';
import {
  BeltLevel,
  FighterLevel,
  MartialLevel,
} from '../enums/martial-level.enum';
import {
  MartialArtInfo,
  SocialLinks,
} from '../../../../core/interface/user-entity.interface';

export class User {
  id: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  bio: string;
  profileImage?: string;
  profileImagePublicId?: string;
  role: UserRole;

  // Información de artes marciales
  principalMartialArt?: MartialArt;
  principalMartialLevel?: MartialLevel;
  principalBeltLevel?: BeltLevel;
  fighterLevel?: FighterLevel;
  martialArts: MartialArtInfo[];

  // Redes sociales
  socialLinks?: SocialLinks;

  // Estadísticas
  followersCount: number;
  followingCount: number;
  postsCount: number;

  // Control
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  canModerate(): boolean {
    return this.isAdmin();
  }
}
