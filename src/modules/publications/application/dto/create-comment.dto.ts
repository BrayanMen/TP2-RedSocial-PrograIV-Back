import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Contenido del comentario',
    example: 'Que buena tecnica, vamos a pararnos de mano',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'El contenido del comentario es obligatorio' })
  @MaxLength(500, {
    message: 'El comentario no puede tener mas de 500 caracteres',
  })
  content: string;
}
