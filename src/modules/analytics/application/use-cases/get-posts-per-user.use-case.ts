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
    // Inyecta el modelo de Mongoose para la colección de publicaciones
    @InjectModel(PostSchema.name) private postModel: Model<PostDocument>,
    // Inyecta el modelo de Mongoose para la colección de usuarios
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>,
  ) {}

  async execute(startDate?: Date, endDate?: Date): Promise<any[]> {
    // Objeto para construir la etapa de $match (filtrado)
    const matchStage: FilterQuery<PostDocument> = {};
    // Si se proporcionan fechas de inicio o fin, construye la condición de fecha
    if (startDate || endDate) {
      // Inicializa el campo createdAt para el filtro
      matchStage.createdAt = {
        // Si hay fecha de inicio, filtra publicaciones creadas en o después de esa fecha
        ...(startDate && { $gte: startDate }),
        // Si hay fecha de fin, filtra publicaciones creadas en o antes de esa fecha
        ...(endDate && { $lte: endDate }),
      };
    }

    // Define el pipeline de agregación de MongoDB
    const pipeline: PipelineStage[] = [
      // Primera etapa: $match - Filtra los documentos de publicaciones
      { $match: matchStage }, // Aplica el filtro de fechas construido anteriormente
      // Segunda etapa: $group - Agrupa los documentos por un campo y realiza operaciones de acumulación
      {
        $group: {
          _id: '$authorId', // Agrupa por el ID del autor de la publicación
          totalPosts: { $sum: 1 }, // Cuenta el número total de publicaciones para cada autor
        },
      },
      // Tercera etapa: $lookup - Realiza una unión (join) con otra colección
      {
        $lookup: {
          from: 'users', // Nombre de la colección con la que se va a unir (la colección de usuarios)
          localField: '_id', // Campo del documento de entrada (resultado del $group, que es el authorId)
          foreignField: '_id', // Campo de la colección 'users' con el que se va a unir
          as: 'authorInfo', // Nombre del nuevo campo que contendrá los documentos unidos de 'users'
        },
      },
      // Cuarta etapa: $unwind - Desestructura un campo de array de los documentos de entrada
      { $unwind: '$authorInfo' }, // Desestructura el array 'authorInfo' (asumiendo que cada autor tiene un solo documento)
      // Quinta etapa: $project - Remodela los documentos, incluyendo, excluyendo o renombrando campos
      {
        $project: {
          _id: 0, // Excluye el campo _id original del resultado
          userId: '$_id', // Renombra el campo _id (que era authorId) a userId
          username: '$authorInfo.username', // Incluye el username del autor
          firstName: '$authorInfo.firstName', // Incluye el firstName del autor
          lastName: '$authorInfo.lastName', // Incluye el lastName del autor
          totalPosts: 1, // Incluye el campo totalPosts
        },
      },
      // Sexta etapa: $sort - Ordena los documentos
      { $sort: { totalPosts: -1 } }, // Ordena los resultados por totalPosts en orden descendente
    ];

    // Ejecuta el pipeline de agregación en la colección de publicaciones
    return this.postModel.aggregate(pipeline).exec();
  }
}
