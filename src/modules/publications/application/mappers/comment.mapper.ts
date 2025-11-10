import { Comment } from '../../domain/entities/comment.entity';
import { CommentDocument } from '../../infrastructure/schemas/comment.schema';

export class CommentMapper {
  static toEntity(doc: CommentDocument): Comment {
    return new Comment({
      id: doc._id.toString(),
      postId: doc.postId.toString(),
      authorId: doc.authorId?._id?.toString() || doc.authorId.toString(),
      content: doc.content,
      isModified: doc.isModified,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
