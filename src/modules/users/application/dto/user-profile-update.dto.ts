import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MartialArt } from '../../domain/enums/martial-art.enum';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  BeltLevel,
  FighterLevel,
  MartialLevel,
} from '../../domain/enums/martial-level.enum';
import { Type } from 'class-transformer';

class MartialArtInfoDto {
  @ApiProperty({ enum: MartialArt, description: 'Arte Marcial' })
  @IsEnum(MartialArt)
  martialArt: MartialArt;

  @ApiProperty({ enum: MartialLevel, description: 'Nivel' })
  @IsEnum(MartialLevel)
  martialLevel: MartialLevel;

  @ApiPropertyOptional({ enum: BeltLevel, description: 'Cinturon' })
  @IsOptional()
  @IsEnum(BeltLevel)
  beltLevel?: BeltLevel;

  @ApiPropertyOptional({
    description: 'Años de Experiencia',
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  yearPractice?: number;

  @ApiProperty({ example: 'Dojo Central', required: false })
  @IsOptional()
  @IsString()
  dojo?: string;
  @ApiProperty({ example: 'Sensei Tanaka', required: false })
  @IsOptional()
  @IsString()
  instructor?: string;

  @ApiProperty({
    example: ['Campeón Regional 2023', 'Medalla de Oro Nacional'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];
}

export class LocationDto {
  @ApiProperty({ example: 'Argentina', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'Buenos Aires', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'CABA', required: false })
  @IsOptional()
  @IsString()
  city?: string;
}

class SocialLinksDto {
  @ApiPropertyOptional({ description: 'Instagram URL' })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional({ description: 'Facebook URL' })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({ description: 'YouTube URL' })
  @IsOptional()
  @IsUrl()
  youtube?: string;

  @ApiPropertyOptional({ description: 'TikTok URL' })
  @IsOptional()
  @IsUrl()
  tiktok?: string;

  @ApiPropertyOptional({ description: 'Website URL' })
  @IsOptional()
  @IsUrl()
  website?: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Nombre' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Apellido' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Biografía', maxLength: 500 })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ type: LocationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiPropertyOptional({
    enum: MartialArt,
    description: 'Arte marcial principal',
  })
  @IsOptional()
  @IsEnum(MartialArt)
  principalMartialArt?: MartialArt;

  @ApiPropertyOptional({ enum: MartialLevel, description: 'Nivel principal' })
  @IsOptional()
  @IsEnum(MartialLevel)
  principalMartialLevel?: MartialLevel;

  @ApiPropertyOptional({ enum: BeltLevel, description: 'Cinturon principal' })
  @IsOptional()
  @IsEnum(BeltLevel)
  principalBeltLevel?: BeltLevel;

  @ApiPropertyOptional({
    enum: FighterLevel,
    description: 'Nivel como peleador',
    example: FighterLevel.AMATEUR,
  })
  @IsOptional()
  @IsEnum(FighterLevel)
  fighterLevel?: FighterLevel;

  @ApiPropertyOptional({
    type: [MartialArtInfoDto],
    description: 'Todas las artes marciales que practica',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MartialArtInfoDto)
  martialArts?: MartialArtInfoDto[];

  @ApiProperty({ example: 'Dojo Central', required: false })
  @IsOptional()
  @IsString()
  currentDojo?: string;

  @ApiProperty({
    example: ['Mejorar técnica', 'Competir nacionalmente'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  martialArtGoals?: string[];

  @ApiPropertyOptional({
    type: SocialLinksDto,
    description: 'Enlaces a redes sociales',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;
}
