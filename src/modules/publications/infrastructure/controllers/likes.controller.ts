import {
  Controller,
  Post,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LikePostUseCase } from '../../application/use-cases/likes/like-post.use-case';
import { AuthGuard } from '../../../../core/guards/auth.guard';
import { DislikePostUseCase } from '../../application/use-cases/likes/dislike-post.use-case';
import { ActualUser } from '../../../../core/decorators/user.decorator';

@ApiTags('Likes')
@Controller('posts/:postId/likes')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class LikesController {
  constructor(
    private readonly likePostUC: LikePostUseCase,
    private readonly dislikePostUC: DislikePostUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dar me gusta a una publicación' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        likesCount: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya has dado me gusta' })
  async likePost(
    @Param('postId') postId: string,
    @ActualUser('sub') userId: string,
  ) {
    return this.likePostUC.execute(postId, userId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Quitar me gusta de una publicación' })
  @ApiResponse({
    status: 200,
    description: 'Me gusta eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        likesCount: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'No has dado me gusta a esta publicación',
  })
  async dislikePost(
    @Param('postId') postId: string,
    @ActualUser('sub') userId: string,
  ) {
    return this.dislikePostUC.execute(postId, userId);
  }
}
