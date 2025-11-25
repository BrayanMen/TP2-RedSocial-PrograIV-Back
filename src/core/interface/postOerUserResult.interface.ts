export interface PostsPerUserResult {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  totalPosts: number;
}
export interface CommentPerPostResult {
  postId: string;
  postTitle: string;
  totalComments: number;
}
