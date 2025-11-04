import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../../core/constants/roles.constant';

export class RegisterDTO {
  @ApiProperty({
    description: 'Correo Electornico',
    example: 'correo@dominio.com',
  })
  @IsEmail({}, { message: 'El correo ingresado no es valido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @ApiProperty({ description: 'Nombre de usuario', example: 'Username1' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @MinLength(4, { message: 'El nombre debe tener minimo 4 caractares' })
  username: string;

  @ApiProperty({
    description: 'Contraseña (Minimo 8 letras, 1 Mayuscula y 1 Numero)',
    example: 'Password123',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos 1 mayúscula y 1 número',
  })
  password: string;

  @ApiProperty({
    description: 'Confirmar Contraseña',
    example: 'Password123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Debes confirmar la contraseña' })
  @MinLength(8, { message: 'La contraseña debe tener 8 caracteres' })
  confirmPassword: string;

  @ApiProperty({ description: 'Nombre', example: 'Pedro' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @ApiProperty({ description: 'Apellido', example: 'Mendoza' })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName: string;

  @ApiProperty({ description: 'Fecha de nacimiento', example: '1999-01-01' })
  @IsDateString({}, { message: 'La fecha de nacimiento no es válida' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  birthDate: string;

  @ApiPropertyOptional({ description: 'Descripción del perfil' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'Rol del usuario (solo admin)',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
