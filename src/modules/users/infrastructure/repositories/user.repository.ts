import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserDocument>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const newUser = new this.userModel(data);
    const savedUser = await newUser.save();
    return this.toEntity(savedUser);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    return user ? this.toEntity(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });
    return user ? this.toEntity(user) : null;
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    const user = await this.userModel.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername },
      ],
    });
    return user ? this.toEntity(user) : null;
  }

  async findAll(skip: number = 0, limit: number = 10): Promise<User[]> {
    const users = await this.userModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    return users.map((u) => this.toEntity(u));
  }

  async countUser(): Promise<number> {
    return this.userModel.countDocuments({ isActive: true });
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    return user ? this.toEntity(user) : null;
  }

  async delete(id: string): Promise<boolean> {
    const userDelete = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    return !!userDelete;
  }

  async activeUser(id: string): Promise<boolean> {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true },
    );
    return !!user;
  }

  private toEntity(doc: UserDocument): User {
    return new User({
      id: doc._id.toString(),
      email: doc.email,
      username: doc.username,
      password: doc.password,
      firstName: doc.firstName,
      lastName: doc.lastName,
      birthDate: doc.birthDate,
      bio: doc.bio,
      profileImage: doc.profileImage,
      profileImagePublicId: doc.profileImagePublicId,
      role: doc.role,
      principalMartialArt: doc.principalMartialArt,
      principalMartialLevel: doc.principalMartialLevel,
      principalBeltLevel: doc.principalBeltLevel,
      fighterLevel: doc.fighterLevel,
      martialArts: doc.martialArts.map((m) => ({
        martialArt: m.martialArt,
        martialLevel: m.level,
        beltLevel: m.beltLevel,
        yearsPractice: m.yearPractice,
      })),
      socialLinks: doc.socialLinks,
      followersCount: doc.followersCount,
      followingCount: doc.followingCount,
      postsCount: doc.postsCount,
      isActive: doc.isActive,
      isVerified: doc.isVerified,
    });
  }
}
