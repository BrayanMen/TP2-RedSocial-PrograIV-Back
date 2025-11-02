import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MartialArt } from '../../domain/enums/martial-art.enum';
import {
  BeltLevel,
  FighterLevel,
  MartialLevel,
} from '../../domain/enums/martial-level.enum';
import { UserRole } from 'src/core/constants/roles.constant';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({ _id: false })
class MartialArtInfoSchema {
  @Prop({ required: true, enum: MartialArt })
  martialArt: MartialArt;
  @Prop({ required: true, enum: MartialLevel })
  level: MartialLevel;
  @Prop({ enum: BeltLevel })
  beltLevel?: BeltLevel;
  @Prop()
  yearPractice?: number;
}

@Schema({ _id: false })
class SocialLinkSchema {
  @Prop()
  instagram?: string;
  @Prop()
  facebook?: string;
  @Prop()
  youtube?: string;
  @Prop()
  tiktok?: string;
  @Prop()
  website?: string;
}

@Schema({ timestamps: true })
export class UserSchema {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;
  @Prop({ required: true, unique: true, trim: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, trim: true })
  firstName: string;
  @Prop({ required: true, trim: true })
  lastName: string;
  @Prop({ required: true })
  birthDate: Date;
  @Prop({ default: '' })
  bio: string;
  @Prop()
  profileImage?: string;
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Información de artes marciales
  @Prop({ enum: MartialArt })
  principalMartialArt?: MartialArt;
  @Prop({ enum: MartialLevel })
  principalMartialLevel?: MartialLevel;
  @Prop({ enum: BeltLevel })
  principalBeltLevel?: BeltLevel;
  @Prop({ enum: FighterLevel, default: FighterLevel.NONE })
  fighterLevel?: FighterLevel;

  @Prop({ type: [MartialArtInfoSchema], default: [] })
  martialArts: MartialArtInfoSchema[];

  // Redes sociales
  @Prop({ type: SocialLinkSchema, default: {} })
  socialLinks?: SocialLinkSchema;

  // Estadísticas
  @Prop({ default: 0 })
  followersCount: number;
  @Prop({ default: 0 })
  followingCount: number;
  @Prop({ default: 0 })
  postsCount: number;

  // Control
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: false })
  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchemaFactory = SchemaFactory.createForClass(UserSchema);
