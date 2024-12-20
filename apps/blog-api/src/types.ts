export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    type: string;
    content: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    draft: boolean;
    archived: boolean;
    image_url: string | null;
    image_alt: string | null;
    metadata: Record<string, unknown>;
    tags: string[];
}

export interface QueryParams {
    drafts?: boolean;
    archived?: boolean;
}