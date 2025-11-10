import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LikeDocument, LikeSchema } from '../schemas/like.schema';
import { Model } from 'mongoose';
import { LikeMapper } from '../../application/mappers/like.mapper';
import { Like } from '../../domain/entities/like.entity';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectModel(LikeSchema.name) private likeModel: Model<LikeDocument>,
  ) {}

  async create(userId: string, postId: string): Promise<Like> {
    const like = new this.likeModel({ userId, postId });
    const saveLike = await like.save();
    return LikeMapper.toEntity(saveLike);
  }

  async findOne(userId: string, postId: string): Promise<Like | null> {
    const like = await this.likeModel.findOne({ userId, postId });
    return like ? LikeMapper.toEntity(like) : null;
  }

  async delete(userId: string, postId: string): Promise<boolean> {
    const likeDelete = await this.likeModel.deleteOne({ userId, postId });
    return likeDelete.deletedCount > 0;
  }

  async existsByUserAndPost(userId: string, postId: string): Promise<boolean> {
    const countLike = await this.likeModel.countDocuments({ userId, postId });
    return countLike > 0;
  }

  async findPostsById(postIds: string[], userId: string): Promise<string[]> {
    const likes = await this.likeModel.find({
      postId: { $in: postIds },
      userId,
    });
    return likes.map((l) => l.postId.toString());
  }
}
