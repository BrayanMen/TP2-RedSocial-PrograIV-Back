import { InjectModel } from '@nestjs/mongoose';
import { PostDocument, PostSchema } from '../schemas/post.schema';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { Post } from '../../domain/entities/post.entity';
import { PostMapper } from '../../application/mappers/post.mapper';
import { PostSortBy } from '../../domain/enums/post-sort.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(PostSchema.name) private postModel: Model<PostDocument>,
  ) {}

  async create(post: Partial<Post>): Promise<Post> {
    const newPost = new this.postModel(post);
    const savePost = await newPost.save();
    return PostMapper.toEntity(savePost);
  }

  async findById(id: string): Promise<Post | null> {
    const post = await this.postModel.findById(id);
    return post ? PostMapper.toEntity(post) : null;
  }

  async findAll(
    skip: number = 0,
    limit: number = 10,
    sortBy: PostSortBy = PostSortBy.DATE,
    authorId?: string,
  ): Promise<Post[]> {
    const query: FilterQuery<PostDocument> = { isActive: true };

    if (authorId) query.authorId = authorId;

    const sortOption: Record<string, SortOrder> =
      sortBy === PostSortBy.LIKES
        ? { likesCount: -1, createdAt: -1 }
        : { createdAt: -1 };

    const post = await this.postModel
      .find(query)
      .populate('authorId', 'username firstName lastName profileImage')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();

    return post.map((p) => PostMapper.toEntity(p));
  }

  async countPost(authorId?: string): Promise<number> {
    const query: FilterQuery<PostDocument> = { isActive: true };
    if (authorId) query.authorId = authorId;
    return this.postModel.countDocuments(query);
  }

  async update(id: string, data: Partial<Post>): Promise<Post | null> {
    const postUpdate = await this.postModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    return postUpdate ? PostMapper.toEntity(postUpdate) : null;
  }

  async delete(id: string): Promise<boolean> {
    const postDelete = await this.postModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    return !!postDelete;
  }

  async incrementLikes(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndUpdate(
      id,
      { $inc: { likesCount: 1 } },
      { new: true },
    );
    return !!result;
  }

  async decrementLikes(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            likesCount: {
              $max: [{ $subtract: ['$likesCount', 1] }, 0],
            },
          },
        },
      ],
      { new: true },
    );
    return !!result;
  }

  async incrementComments(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndUpdate(
      id,
      { $inc: { commentsCount: 1 } },
      { new: true },
    );
    return !!result;
  }

  async decrementComments(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            commentsCount: {
              $max: [{ $subtract: ['$commentsCount', 1] }, 0],
            },
          },
        },
      ],
      { new: true },
    );
    return !!result;
  }

  async incrementReposts(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndUpdate(
      id,
      { $inc: { repostsCount: 1 } },
      { new: true },
    );
    return !!result;
  }

  async decrementReposts(id: string): Promise<boolean> {
    const result = await this.postModel.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            repostsCount: {
              $max: [{ $subtract: ['$commentsCount', 1] }, 0],
            },
          },
        },
      ],
      { new: true },
    );
    return !!result;
  }
  async exists(id: string): Promise<boolean> {
    const count = await this.postModel.countDocuments({
      _id: id,
      isActive: true,
    });
    return count > 0;
  }

  async findByAuthor(authorId: string, limit: number = 10): Promise<Post[]> {
    const posts = await this.postModel
      .find({ authorId, isActive: true })
      .populate('authorId', 'username firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return posts.map((p) => PostMapper.toEntity(p));
  }
}
