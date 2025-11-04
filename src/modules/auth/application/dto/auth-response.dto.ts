import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../../modules/users/application/dto/user-response-dto';

export class AuthResponseDto {
  @ApiProperty({ description: 'Token de JWT' })
  token?: string;

  @ApiProperty({ description: 'Refresh Token de JWT' })
  refreshToken?: string;

  @ApiProperty({
    type: UserResponseDto,
    description: 'Datos del usuario',
  })
  user?: UserResponseDto;

  @ApiProperty({ description: 'Expiracion del token' })
  expiresIn: number;
}
