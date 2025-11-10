import { Post } from '../../domain/entities/post.entity';
import { PostDocument } from '../../infrastructure/schemas/post.schema';

export class PostMapper {
  static toEntity(doc: PostDocument): Post {
    return new Post({
      id: doc._id.toString(),
      authorId: doc.authorId?._id?.toString() || doc.authorId.toString(),
      title: doc.title,
      content: doc.content,
      image: doc.image,
      imagePublicId: doc.imagePublicId,
      type: doc.type,
      likesCount: doc.likesCount,
      commentsCount: doc.commentsCount,
      repostsCount: doc.repostsCount,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
