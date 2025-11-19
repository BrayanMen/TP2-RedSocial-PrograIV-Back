import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  CommentDocument,
  CommentSchema,
} from 'src/modules/publications/infrastructure/schemas/comment.schema';

@Injectable()
export class GetCommentsByRangeUseCase {
  constructor(
    @InjectModel(CommentSchema.name)
    private commentModel: Model<CommentDocument>,
  ) {}

  async execute(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ totalComments: number }> {
    const matchStage: FilterQuery<CommentDocument> = {};
    if (startDate || endDate) {
      // Inicializa el campo createdAt para el filtro
      matchStage.createdAt = {
        // Si hay fecha de inicio, filtra publicaciones creadas en o después de esa fecha
        ...(startDate && { $gte: startDate }),
        // Si hay fecha de fin, filtra publicaciones creadas en o antes de esa fecha
        ...(endDate && { $lte: endDate }),
      };
    }
    //Cuento la cantidad de comentarios en la base de datos
    const totalComments = await this.commentModel
      .countDocuments(matchStage)
      .exec();
    return { totalComments };
  }
}
