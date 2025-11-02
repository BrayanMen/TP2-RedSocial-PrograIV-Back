import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Correo o Username',
    example: 'correo@dominio.com o Username123',
  })
  @IsString()
  @IsNotEmpty({ message: 'El correo o username es obligatorio' })
  emailOrUsername: string;

  @ApiProperty({ description: 'Contraseña', example: 'Password123' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}
