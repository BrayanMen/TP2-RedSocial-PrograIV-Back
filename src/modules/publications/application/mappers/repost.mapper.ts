import { Repost } from '../../domain/entities/repost.entity';
import { RepostDocument } from '../../infrastructure/schemas/repost.schema';

export class RepostMapper {
  static toEntity(doc: RepostDocument): Repost {
    return new Repost({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      postId: doc.postId.toString(),
      originalAuthorId: doc.originalAuthorId.toString(),
      comment: doc.comment,
      createdAt: doc.createdAt,
    });
  }
}
