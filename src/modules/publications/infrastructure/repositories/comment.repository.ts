import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentDocument, CommentSchema } from '../schemas/comment.schema';
import { Model } from 'mongoose';
import { CommentMapper } from '../../application/mappers/comment.mapper';
import { Comment } from '../../domain/entities/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(CommentSchema.name)
    private commentModel: Model<CommentDocument>,
  ) {}

  async create(comment: Partial<Comment>): Promise<Comment> {
    const newComment = new this.commentModel(comment);
    const saved = await newComment.save();
    const populated = await saved.populate(
      'authorId',
      'username firstName lastName profileImage',
    );
    return CommentMapper.toEntity(populated);
  }

  async findById(id: string): Promise<Comment | null> {
    const comment = await this.commentModel
      .findById(id)
      .populate('authorId', 'username firstName lastName profileImage');
    return comment ? CommentMapper.toEntity(comment) : null;
  }

  async findByPostId(
    postId: string,
    skip: number = 0,
    limit: number = 10,
  ): Promise<Comment[]> {
    const comments = await this.commentModel
      .find({ postId, isActive: true })
      // .populate('authorId', 'username firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return comments.map((comment) => CommentMapper.toEntity(comment));
  }

  async countByPostId(postId: string): Promise<number> {
    return this.commentModel.countDocuments({ postId, isActive: true });
  }

  async update(id: string, content: string): Promise<Comment | null> {
    const updated = await this.commentModel
      .findByIdAndUpdate(id, { content, isModified: true }, { new: true })
      .populate('authorId', 'username firstName lastName profileImage');
    return updated ? CommentMapper.toEntity(updated) : null;
  }

  async delete(id: string): Promise<boolean> {
    const commentDelete = await this.commentModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    return !!commentDelete;
  }
}
