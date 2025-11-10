import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from '../../domain/enums/post-type.enum';

export class PostAuthorDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional()
  profileImage?: string;
}

export class PostResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: PostAuthorDto })
  author: PostAuthorDto;

  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;

  @ApiPropertyOptional()
  image?: string;
  @ApiPropertyOptional()
  imagePublicId?: string;

  @ApiProperty({ enum: PostType })
  type: PostType;

  @ApiProperty()
  likesCount: number;

  @ApiProperty()
  commentsCount: number;

  @ApiProperty()
  repostsCount: number;

  @ApiProperty()
  isLikedByMe: boolean;

  @ApiProperty()
  isRepostedByMe: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
