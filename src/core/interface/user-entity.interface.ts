import { MartialArt } from 'src/modules/users/domain/enums/martial-art.enum';
import {
  BeltLevel,
  MartialLevel,
} from 'src/modules/users/domain/enums/martial-level.enum';

export interface MartialArtInfo {
  martialArt: MartialArt;
  martialLevel: MartialLevel;
  beltLevel?: BeltLevel;
  yearsPractice?: number;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  website?: string;
}
