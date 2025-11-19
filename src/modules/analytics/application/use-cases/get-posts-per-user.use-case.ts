import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, PipelineStage } from 'mongoose';
import {
  PostSchema,
  PostDocument,
} from '../../../publications/infrastructure/schemas/post.schema';
import {
  UserSchema,
  UserDocument,
} from '../../../users/infrastructure/schemas/user.schema';

@Injectable()
export class GetPostsPerUserUseCase {
  constructor(
    @InjectModel(PostSchema.name) private postModel: Model<PostDocument>,
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>, // Inyectamos para obtener el nombre real de la colección
  ) {}

  async execute(startDate?: Date, endDate?: Date): Promise<any[]> {
    const matchStage: FilterQuery<PostDocument> = { isActive: true };

    if (startDate || endDate) {
      matchStage.createdAt = {
        ...(startDate && { $gte: startDate }),
        ...(endDate && { $lte: endDate }),
      };
    }

    // Obtenemos el nombre real de la colección de usuarios
    const usersCollectionName = this.userModel.collection.name;

    const pipeline: PipelineStage[] = [
      { $match: matchStage },

      // 2. CORRECCIÓN CRÍTICA: Convertir authorId (string) a ObjectId
      {
        $addFields: {
          convertedAuthorId: { $toObjectId: '$authorId' },
        },
      },

      // 3. Agrupar usando el ID convertido
      {
        $group: {
          _id: '$convertedAuthorId', // Agrupamos por el ID ya convertido
          totalPosts: { $sum: 1 },
        },
      },

      // 4. Lookup usando el ID convertido y el nombre correcto de la colección
      {
        $lookup: {
          from: usersCollectionName,
          localField: '_id', // Ahora _id es un ObjectId válido
          foreignField: '_id',
          as: 'authorInfo',
        },
      },

      { $unwind: '$authorInfo' },

      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: '$authorInfo.username',
          firstName: '$authorInfo.firstName',
          lastName: '$authorInfo.lastName',
          totalPosts: 1,
        },
      },

      { $sort: { totalPosts: -1 } },
    ];

    return await this.postModel.aggregate(pipeline).exec();
  }
}
