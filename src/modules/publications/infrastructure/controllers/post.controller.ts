import {
  Controller,
  Get,
  Post,
  Delete,
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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from '../../../../core/guards/roles.guard';

import { CreatePostDto } from '../../application/dto/create-post.dto';
import { PostResponseDto } from '../../application/dto/post-response.dto';
import { CreatePostUseCase } from '../../application/use-cases/posts/create-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/posts/delete-post.use-case';
import { AuthGuard } from '../../../../core/guards/auth.guard';
import { ActualUser } from '../../../../core/decorators/user.decorator';
import { GetFeedCaseUse } from '../../application/use-cases/posts/get-feed.use-case';
import { PostSortBy } from '../../domain/enums/post-sort.enum';
import { UserRole } from '../../../../core/constants/roles.constant';

@ApiTags('Publicaciones')
@Controller('posts')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PostsController {
  constructor(
    private readonly createPostUC: CreatePostUseCase,
    private readonly getFeedUC: GetFeedCaseUse,
    private readonly deletePostUC: DeletePostUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Crear una nueva publicación' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Publicación creada',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async createPost(
    @ActualUser('sub') userId: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ): Promise<PostResponseDto> {
    return this.createPostUC.execute(userId, createPostDto, image);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener feed de publicaciones',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: PostSortBy,
    example: 'date',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: String,
    description: 'Filtrar por usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Feed obtenido',
  })
  async getFeed(
    @ActualUser('sub') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: PostSortBy = PostSortBy.DATE,
    @Query('userId') filterByUserId?: string,
  ) {
    return this.getFeedUC.execute(
      userId,
      Number(page),
      Number(limit),
      sortBy,
      filterByUserId,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Eliminar publicación ' })
  @ApiResponse({
    status: 200,
    description: 'Publicación eliminada',
  })
  @ApiResponse({ status: 403, description: 'No tienes permisos' })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  async deletePost(
    @Param('id') postId: string,
    @ActualUser('sub') userId: string,
    @ActualUser('role') userRole: UserRole,
  ): Promise<{ message: string }> {
    await this.deletePostUC.execute(postId, userId, userRole);
    return { message: 'Publicación eliminada' };
  }
}
