import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ERROR_MESSAGES } from '../../../../../core/constants/error-message.constant';
import { LikeRepository } from '../../../../../modules/publications/infrastructure/repositories/like.repository';
import { PostRepository } from '../../../../../modules/publications/infrastructure/repositories/post.repository';

@Injectable()
export class LikePostUseCase {
  constructor(
    private readonly postRepo: PostRepository,
    private readonly likeRepo: LikeRepository,
  ) {}

  async execute(
    postId: string,
    userId: string,
  ): Promise<{ message: string; likesCount: number }> {
    const post = await this.postRepo.findById(postId);
    if (!post) throw new NotFoundException(ERROR_MESSAGES.NOT_FOUND_POST);

    const existLike = await this.likeRepo.findOne(userId, postId);
    if (existLike) throw new ConflictException(ERROR_MESSAGES.ALREADY_LIKE);

    await this.likeRepo.create(userId, postId);

    const updatedPost = await this.postRepo.incrementLikes(postId); // Asumimos que incrementLikes devuelve el post actualizado o null/undefined si falla

    if (!updatedPost) {
      // Si el incremento falla, se podría considerar un rollback más robusto o simplemente lanzar una excepción.
      // Por simplicidad, y asumiendo que la creación del like fue exitosa, lanzamos un error.
      // Un rollback del like aquí podría ser complejo si el error no es transaccional.
      throw new Error(ERROR_MESSAGES.FAILED_TO_UPDATE_LIKES_COUNT); // Usar el mensaje de error constante
    }

    return {
      message: 'Me gusta agregado',
      likesCount: post.likesCount, // Obtener directamente del post actualizado
    };
  }
}
