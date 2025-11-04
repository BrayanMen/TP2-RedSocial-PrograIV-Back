import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../../../../core/guards/auth.guard';
import { UserResponseDto } from '../../application/dto/user-response-dto';
import { ActualUser } from '../../../../core/decorators/user.decorator';
import { UpdateProfileDto } from '../../application/dto/user-profile-update.dto';
import { RolesGuard } from '../../../../core/guards/roles.guard';
import { Roles } from '../../../../core/decorators/roles.decorator';
import { UserRole } from '../../../../core/constants/roles.constant';
import type { JwtPayload } from '../../../../core/interface/jwt-payload.interface';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { UpdateUserProfileUseCase } from '../../application/use-cases/update-user-profile.use-case';
import { GetUserProfileUseCase } from '../../application/use-cases/get-user-profile.use-case';

@ApiTags('Usuarios')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
  ) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener perfil del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Usuario no autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard)
  async getMyProfile(@ActualUser() user: JwtPayload): Promise<UserResponseDto> {
    return await this.getUserProfileUseCase.execute(user.sub);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario obtenido exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.getUserProfileUseCase.execute(id);
  }

  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({ summary: 'Modificar perfil de usuari' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(AuthGuard)
  async updateMyProfile(
    @ActualUser('sub') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    profileImage?: Express.Multer.File,
  ): Promise<UserResponseDto> {
    return this.updateUserProfileUseCase.execute(
      userId,
      updateProfileDto,
      profileImage,
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Traer todos los usuarios (paginados)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/UserResponseDto' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            hasPreviousPage: { type: 'boolean' },
          },
        },
      },
    },
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.getAllUsersUseCase.execute(Number(page), Number(limit));
  }
}
