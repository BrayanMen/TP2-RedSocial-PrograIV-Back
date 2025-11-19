import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import {
  CommentDocument,
  CommentSchema,
} from 'src/modules/publications/infrastructure/schemas/comment.schema';
import {
  PostDocument,
  PostSchema,
} from 'src/modules/publications/infrastructure/schemas/post.schema';

@Injectable()
export class GetCommentsPerPostUseCase {
  constructor(
    @InjectModel(CommentSchema.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(PostSchema.name) private postModel: Model<PostDocument>,
  ) {}

  async execute(startDate?: Date, endDate?: Date): Promise<any[]> {
    const matchStage: FilterQuery<CommentDocument> = {};
    if (startDate || endDate) {
      matchStage.createdAt = {
        ...(startDate && { $gte: startDate }),
        ...(endDate && { $lte: endDate }),
      };
    }
    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $group: {
          _id: '$postId', // Corregido
          totalComments: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: '_id',
          as: 'postInfo',
        },
      },
      { $unwind: '$postInfo' },
      {
        $project: {
          _id: 0,
          postId: '$_id',
          postTitle: '$postInfo.title',
          totalComments: 1,
        },
      },
      { $sort: { totalComments: -1 } },
    ];
    return this.commentModel.aggregate(pipeline).exec();
  }
}
