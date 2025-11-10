import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../../infrastructure/repositories/post.repository';
import { CloudinaryService } from '../../../../../shared/cloudinary/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserDocument,
  UserSchema,
} from '../../../../../modules/users/infrastructure/schemas/user.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from '../../dto/create-post.dto';
import { PostResponseDto } from '../../dto/post-response.dto';
import { PostType } from '../../../domain/enums/post-type.enum';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(UserSchema.name)
    private userModel: Model<UserDocument>,
  ) {}

  async execute(
    userId: string,
    createPostDto: CreatePostDto,
    image?: Express.Multer.File,
  ): Promise<PostResponseDto> {
    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (image) {
      const upload = await this.cloudinaryService.uploadImage(image);
      imageUrl = upload.secure_url;
      imagePublicId = upload.public_id;
    }

    const post = await this.postRepository.create({
      authorId: userId,
      title: createPostDto.title,
      image: imageUrl,
      imagePublicId: imagePublicId,
      type: createPostDto.type || PostType.GENERAL,
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
      isActive: true,
    });

    await this.userModel.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

    const author = await this.userModel.findById(userId);

    return {
      id: post.id,
      author: {
        id: author?._id.toString() || '',
        username: author?.username || '',
        firstName: author?.firstName || '',
        lastName: author?.lastName || '',
        profileImage: author?.profileImage,
      },
      title: post.title,
      content: post.content,
      image: post.image,
      type: post.type,
      likesCount: post.likesCount,
      commentsCount: post.commentsCount,
      repostsCount: post.repostsCount,
      isLikedByMe: false,
      isRepostedByMe: false,
      createdAt: post.createdAt,
      updatedAt: post.createdAt,
    };
  }
}
