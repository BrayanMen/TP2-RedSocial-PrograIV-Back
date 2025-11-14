import {
  Body,
  Controller,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterUseCase } from '../../application/use-cases/register.use-cases';
import { LoginUseCase } from '../../application/use-cases/login.use-cases';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { RegisterDTO } from '../../application/dto/register.dto';
import { LoginDto } from '../../application/dto/login.dto';
import { JwtTokenService } from '../../application/services/jwt-token.service';
import type { Request, Response } from 'express';
import { JwtPayload } from '../../../../core/interface/jwt-payload.interface';
import { RefreshTokenUseCases } from '../../application/use-cases/refresh-token.use-cases';
import { AuthorizaUseCase } from '../../application/use-cases/authoriza.use-cases';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtTokenService: JwtTokenService,
    private readonly refresfTokenUseCase: RefreshTokenUseCases,
    private readonly authorizeUseCase: AuthorizaUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({ summary: 'Registrar un usuario' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'email',
        'username',
        'password',
        'confirmPassword',
        'firstName',
        'lastName',
        'birthDate',
      ],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'usuario@domain.com',
        },
        username: { type: 'string', example: 'Username123' },
        password: {
          type: 'string',
          format: 'password',
          example: 'Password123',
        },
        confirmPassword: {
          type: 'string',
          format: 'password',
          example: 'Password123',
        },
        firstName: { type: 'string', example: 'Pepe' },
        lastName: { type: 'string', example: 'Mendoza' },
        birthDate: { type: 'string', format: 'date', example: '1999-01-01' },
        bio: {
          type: 'string',
          example:
            'Artista marcial de 5 años de recorrido, practicantes de distintas disciplinas',
        },
        profileImage: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  async register(
    @Body() registerDto: RegisterDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    profileImage?: Express.Multer.File,
  ): Promise<AuthResponseDto> {
    return this.registerUseCase.execute(registerDto, profileImage);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de Sesion Exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const login = await this.loginUseCase.execute(loginDto);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('jwt', login.token, {
      httpOnly: true,
      secure: isProduction, // solo HTTPS en prod
      maxAge: login.expiresIn * 1000, // en ms
      sameSite: isProduction ? 'none' : 'lax', // previene CSRF
    });

    res.cookie('refreshToken', login.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
      sameSite: isProduction ? 'none' : 'lax',
    });
    return {
      token: login.token,
      user: login.user,
      expiresIn: login.expiresIn,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar Token' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const refreshToken: string | undefined = req.cookies['refreshToken'] as
      | string
      | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token not provided');
    }
    return this.refresfTokenUseCase.execute(refreshToken, res);
  }

  @Post('authorize')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validar token actual' })
  @ApiResponse({ status: 200, description: 'Token válido' })
  @ApiResponse({ status: 401, description: 'Token inválido o vencido' })
  async authorize(
    @Req() req: Request,
  ): Promise<{ valid: boolean; user: JwtPayload }> {
    const token: string | undefined = req.cookies['jwt'] as string | undefined;
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }
    const payload = await this.authorizeUseCase.execute(token);

    return {
      valid: true,
      user: {
        sub: payload.userId,
        username: payload.username,
        email: payload.email,
        role: payload.role,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Cierre de Sesion Exitoso',
  })
  @ApiResponse({ status: 400, description: 'No pudo cerrar sesion' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    return { message: 'Sesión cerrada' };
  }
}
