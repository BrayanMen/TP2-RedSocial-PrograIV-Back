import { Like } from '../../domain/entities/like.entity';
import { LikeDocument } from '../../infrastructure/schemas/like.schema';

export class LikeMapper {
  static toEntity(doc: LikeDocument): Like {
    return new Like({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      postId: doc.postId.toString(),
      createdAt: doc.createdAt,
    });
  }
}
