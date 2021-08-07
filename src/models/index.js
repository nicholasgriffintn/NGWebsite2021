// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PostStatus = {
  "DRAFT": "DRAFT",
  "PRIVATE": "PRIVATE",
  "SUBSCRIBER": "SUBSCRIBER",
  "PUBLISHED": "PUBLISHED"
};

const { Post, Comment, Tags } = initSchema(schema);

export {
  Post,
  Comment,
  PostStatus,
  Tags
};