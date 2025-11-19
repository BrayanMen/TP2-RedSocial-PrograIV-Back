import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { UserRole } from 'src/core/constants/roles.constant';
import { UserResponseDto } from '../../application/dto/user-response-dto';
import { CreateUserByAdminDto } from '../../application/dto/create-user-by-admin.dto';
import { CreateUserByAdminUseCase } from '../../application/use-cases/create-user-by-admin.use-cases';
import { DisableUserUseCase } from '../../application/use-cases/disable-user.use-case';
import { ActiveUserUseCase } from '../../application/use-cases/active-user.use-case';

@ApiTags('Admin')
@Controller('admin/users')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class AdminUsersController {
  constructor(
    private readonly getAllUsersUC: GetAllUsersUseCase,
    private readonly createUserByAdminUC: CreateUserByAdminUseCase,
    private readonly disableUserUC: DisableUserUseCase,
    private readonly activeUserUC: ActiveUserUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Traer todos los usuarios (Admin)' })
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
  @Roles(UserRole.ADMIN)
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.getAllUsersUC.execute(page, limit);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear usuario nuevo (Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Usuario Creado',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  @Roles(UserRole.ADMIN)
  async registerAdminUser(
    @Body() createUserByAdmin: CreateUserByAdminDto,
  ): Promise<UserResponseDto> {
    return this.createUserByAdminUC.execute(createUserByAdmin);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deshabilitar usuario (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario deshabilitado',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Roles(UserRole.ADMIN)
  async disableUserByAdmin(
    @Param('id') userId: string,
  ): Promise<UserResponseDto> {
    return this.disableUserUC.execute(userId);
  }

  @Post(':id/active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Habilitar usuario (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario Activado',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Roles(UserRole.ADMIN)
  async activeUser(@Param('id') userId: string): Promise<UserResponseDto> {
    return this.activeUserUC.execute(userId);
  }
}
