import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Contenido editado del comentario',
    example: 'Vamos a caernos a coñazo (editado)',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'El contenido del comentario es obligatorio' })
  @MaxLength(500, { message: 'El comentario no puede exceder 500 caracteres' })
  content: string;
}
