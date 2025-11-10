import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PostType } from '../../domain/enums/post-type.enum';

export class CreatePostDto {
  @ApiProperty({
    description: 'Titulo de la publicacion',
    example: 'Hoy voy a practicar el siguiente Kata',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, {
    message: 'El titulo no puede tener mas de 200 caracteres',
  })
  title: string;

  @ApiProperty({
    description: 'Contenido de la publicacion',
    example: 'Hoy decidi hacer el Kata Tekki',
    maxLength: 2000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, {
    message: 'La publicacion no puede tener mas de 2000 caracteres',
  })
  content: string;

  @ApiPropertyOptional({
    enum: PostType,
    description: 'Tipo de publicacion',
    default: PostType.GENERAL,
  })
  @IsOptional()
  @IsEnum(PostType, { message: 'Tipo de publicacion invalido' })
  type?: PostType;
}
