import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { UserRole } from 'src/core/constants/roles.constant';
import { Roles } from 'src/core/decorators/roles.decorator';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { GetPostsPerUserUseCase } from '../../application/use-cases/get-posts-per-user.use-case';
import { GetCommentsByRangeUseCase } from '../../application/use-cases/get-comments-by-range.use-case';
import { GetCommentsPerPostUseCase } from '../../application/use-cases/get-comments-per-post.use-case';

@ApiTags('Estadisticas')
@Controller('admin/analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AnalyticsController {
  constructor(
    private readonly getPostPerUserUC: GetPostsPerUserUseCase,
    private readonly getCommentsByRangeUC: GetCommentsByRangeUseCase,
    private readonly getCommentsPerPageUC: GetCommentsPerPostUseCase,
  ) {}

  @Get('posts-per-user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener estadisticas de publicaciones por usuario',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Date,
    description: 'Fecha de inicio',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
    description: 'Fecha de fin',
  })
  @ApiResponse({ status: 200, description: 'Estadisticas obtenidas' })
  async getPostsPerUser(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.getPostPerUserUC.execute(start, end);
  }

  @Get('comments-by-range')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener estadisticas de comentarios por rango de tiempo',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Date,
    description: 'Fecha de inicio',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
    description: 'Fecha de fin',
  })
  @ApiResponse({ status: 200, description: 'Comentarios obtenidos' })
  async getCommentsByRange(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.getCommentsByRangeUC.execute(start, end);
  }

  @Get('comments-per-post')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener estadisticas de comentarios por publicaciones',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: Date,
    description: 'Fecha de inicio',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
    description: 'Fecha de fin',
  })
  @ApiResponse({ status: 200, description: 'Comentarios obtenidos' })
  async getCommentsPerPost(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.getCommentsPerPageUC.execute(start, end);
  }
}
