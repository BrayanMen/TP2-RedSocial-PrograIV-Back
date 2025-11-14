import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../../../../../core/constants/error-message.constant';
import { LikeRepository } from '../../../infrastructure/repositories/like.repository';
import { PostRepository } from '../../../infrastructure/repositories/post.repository';

@Injectable()
export class DislikePostUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly likeRepo: LikeRepository,
  ) {}

  async execute(
    postId: string,
    userId: string,
  ): Promise<{ message: string; likesCount: number }> {
    const post = await this.postRepo.findById(postId);
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND_POST);
    }

    const existLike = await this.likeRepo.findOne(userId, postId);
    if (!existLike) {
      throw new NotFoundException(ERROR_MESSAGES.NOT_LIKE);
    }

    await this.likeRepo.delete(userId, postId);

    const updatedPost = await this.postRepo.decrementLikes(postId); // Asumimos que decrementLikes devuelve el post actualizado o null/undefined si falla

    if (!updatedPost) {
      // Si el decremento falla, se podría considerar un rollback más robusto o simplemente lanzar una excepción.
      // Por simplicidad, y asumiendo que el delete del like fue exitoso, lanzamos un error.
      // Un rollback del like aquí podría ser complejo si el error no es transaccional.
      throw new Error(ERROR_MESSAGES.FAILED_TO_UPDATE_LIKES_COUNT); // Usar un mensaje de error constante
    }

    return {
      message: 'Me gusta eliminado',
      likesCount: post.likesCount, // Obtener directamente del post actualizado
    };
  }
}
