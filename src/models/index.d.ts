import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum PostStatus {
  DRAFT = "DRAFT",
  PRIVATE = "PRIVATE",
  SUBSCRIBER = "SUBSCRIBER",
  PUBLISHED = "PUBLISHED"
}

export declare class Tags {
  readonly name: string;
  constructor(init: ModelInit<Tags>);
}

type PostMetaData = {
  readOnlyFields;
}

type CommentMetaData = {
  readOnlyFields;
}

export declare class Post {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: PostStatus | keyof typeof PostStatus;
  readonly tags?: Tags;
  readonly thumbnail: string;
  readonly header: string;
  readonly ctime?: string;
  readonly content: string;
  readonly comments?: (Comment | null)[];
  readonly createdAt: string;
  readonly updatedAt: string;
  constructor(init: ModelInit<Post>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}

export declare class Comment {
  readonly id: string;
  readonly post?: Post;
  readonly content: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  constructor(init: ModelInit<Comment>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment>) => MutableModel<Comment> | void): Comment;
}