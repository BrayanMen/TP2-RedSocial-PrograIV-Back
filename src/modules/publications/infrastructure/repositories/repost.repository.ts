import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RepostDocument, RepostSchema } from '../schemas/repost.schema';
import { Model } from 'mongoose';
import { Repost } from '../../domain/entities/repost.entity';
import { RepostMapper } from '../../application/mappers/repost.mapper';

@Injectable()
export class RepostRepository {
  constructor(
    @InjectModel(RepostSchema.name) private repostModel: Model<RepostDocument>,
  ) {}

  async create(repost: Partial<Repost>): Promise<Repost> {
    const newRepost = new this.repostModel(repost);
    const saveRepost = await newRepost.save();
    return RepostMapper.toEntity(saveRepost);
  }

  async findById(id: string): Promise<Repost | null> {
    const repost = await this.repostModel.findById(id);
    return repost ? RepostMapper.toEntity(repost) : null;
  }

  async findOne(userId: string, postId: string): Promise<Repost | null> {
    const repost = await this.repostModel.findOne({ userId, postId });
    return repost ? RepostMapper.toEntity(repost) : null;
  }
  async delete(userId: string, postId: string): Promise<boolean> {
    const result = await this.repostModel.deleteOne({ userId, postId });
    return result.deletedCount > 0;
  }

  async existsByUserAndPost(userId: string, postId: string): Promise<boolean> {
    const count = await this.repostModel.countDocuments({ userId, postId });
    return count > 0;
  }

  async findPostsIds(postIds: string[], userId: string): Promise<string[]> {
    const reposts = await this.repostModel.find({
      postId: { $in: postIds },
      userId,
    });
    return reposts.map((repost) => repost.postId.toString());
  }
}
