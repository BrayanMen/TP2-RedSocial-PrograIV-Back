import { Injectable } from '@nestjs/common';
import { MartialArt } from '../users/domain/enums/martial-art.enum';
import {
  BeltLevel,
  FighterLevel,
  MartialLevel,
} from '../users/domain/enums/martial-level.enum';

@Injectable()
export class DataService {
  getProfileOptions() {
    return {
      martialArts: Object.values(MartialArt),
      martialLevels: Object.values(MartialLevel),
      beltLevels: Object.values(BeltLevel),
      fighterLevels: Object.values(FighterLevel),
    };
  }
}
