export type Metadata = {
  title: string;
  date: string;
  updated?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  hideFeaturedImage?: boolean;
  archived?: boolean;
  draft?: boolean;
  tags: string[];
  link?: string;
};
