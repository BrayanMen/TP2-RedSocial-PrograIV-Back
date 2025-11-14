import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateCommentDto } from '../../application/dto/create-comment.dto';
import { UpdateCommentDto } from '../../application/dto/update-comment.dto';
import { CommentResponseDto } from '../../application/dto/comment-response.dto';
import { CreateCommentUseCase } from '../../application/use-cases/comments/create-comment.use-case';
import { UpdateCommentUseCase } from '../../application/use-cases/comments/update-comment.use-case';
import { ActualUser } from 'src/core/decorators/user.decorator';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { GetCommentsUseCase } from '../../application/use-cases/comments/get-comment.use-case';
import { DeleteCommentUseCase } from '../../application/use-cases/comments/delete-comment.use-case';
import { UserRole } from 'src/core/constants/roles.constant';
import { RolesGuard } from 'src/core/guards/roles.guard';

@ApiTags('Comentarios')
@Controller('posts/:postId/comments')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(
    private readonly createCommentUC: CreateCommentUseCase,
    private readonly getCommentsUC: GetCommentsUseCase,
    private readonly updateCommentUC: UpdateCommentUseCase,
    private readonly deleteCommentUC: DeleteCommentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un comentario en una publicación' })
  @ApiResponse({
    status: 201,
    description: 'Comentario creado',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  async createComment(
    @Param('postId') postId: string,
    @ActualUser('sub') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.createCommentUC.execute(postId, userId, createCommentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Traer comentarios de una publicación',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Comentarios obtenidos',
  })
  async getComments(
    @Param('postId') postId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.getCommentsUC.execute(postId, page, limit);
  }

  @Put(':commentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un comentario' })
  @ApiResponse({
    status: 200,
    description: 'Comentario actualizado',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 403, description: 'No tienes permisos' })
  @ApiResponse({ status: 404, description: 'Comentario no encontrado' })
  async updateComment(
    @Param('commentId') commentId: string,
    @ActualUser('sub') userId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    return this.updateCommentUC.execute(commentId, userId, updateCommentDto);
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Eliminar Comentario ' })
  @ApiResponse({
    status: 200,
    description: 'Comentario eliminada',
  })
  @ApiResponse({ status: 403, description: 'No tienes permisos' })
  @ApiResponse({ status: 404, description: 'Comentario no encontrada' })
  async deleteComment(
    @Param('commentId') commentId: string,
    @ActualUser('sub') userId: string,
    @ActualUser('role') userRole: UserRole,
  ): Promise<{ message: string }> {
    await this.deleteCommentUC.execute(commentId, userId, userRole);
    return { message: 'Comentario eliminada' };
  }
}
