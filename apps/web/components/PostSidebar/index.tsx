import { Suspense } from "react";

import { Metadata } from "@/types/blog";
import { FeaturedImage } from "@/components/FeaturedImage";
import { AudioPlayer } from "@/components/AudioPlayer";

export function PostSidebar({ post }: { post: Metadata }) {
    return (
        <aside className="mt-4 md:mt-8">
            {post.image_url && !post.metadata.hideFeaturedImage && (
                <div className="mt-4">
                    <FeaturedImage src={post.image_url} alt={post.image_alt || post.title} />
                </div>
            )}

            <Suspense fallback={<div>Loading audio player...</div>}>
                {post.audio_url && !post.metadata.hideAudio && (
                    <div className="mt-4">
                        <div className="flex items-center gap-2 mb-3 text-card-foreground">
                            <h3 className="font-semibold">Listen to this post</h3>
                        </div>
                        <AudioPlayer src={`https://ng-blog.s3rve.co.uk/${post.audio_url}`} />
                    </div>
                )}
            </Suspense>
        </aside>
    );
}