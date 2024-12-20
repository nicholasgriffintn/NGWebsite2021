import { QueueMessage } from "./types";
import { StorageService } from "./services/storage";
import { parseFrontmatter, formatContentForSpeech } from "./utils";
import { DeepgramService } from "./services/deepgram";
import { ElevenLabsService } from "./services/elevenlabs";

const handler: ExportedHandler<{ DB: D1Database, BUCKET: R2Bucket, DEEPGRAM_API_KEY: string, ELEVEN_LABS_API_KEY: string }, QueueMessage> = {
    async queue(batch: MessageBatch<QueueMessage>, env: { BUCKET: R2Bucket, DB: D1Database, DEEPGRAM_API_KEY: string, ELEVEN_LABS_API_KEY: string }): Promise<void> {
        if (batch.messages.length === 0) {
            return;
        }

        const storageService = new StorageService(env.BUCKET);
        const deepgramService = new DeepgramService(env.DEEPGRAM_API_KEY);
        const elevenLabsService = new ElevenLabsService(env.ELEVEN_LABS_API_KEY);

        const results = await Promise.allSettled(
            batch.messages.map(async message => {
                console.log(`Processing ${message.body.object.key}`);

                const paths = message.body.object.key.split("/");
                const slug = paths[paths.length - 1]?.replace(".md", "") || "";

                const findStmt = env.DB.prepare(
                    "SELECT * FROM document WHERE id = ?"
                );
                const result = await findStmt.bind(slug).first();

                if (result?.audio_url) {
                    console.log(`Document ${message.body.object.key} already has audio`);
                    return;
                }

                if (result?.draft === true || result?.archived === true) {
                    console.log(`Document ${message.body.object.key} is a draft or archived`);
                    return;
                }

                const content = await storageService.getObject(message.body.object.key);
                if (!content) {
                    console.log(`Object ${message.body.object.key} not found`);
                    return;
                }

                const { content: blogContent } = parseFrontmatter(content);
                const formattedContent = formatContentForSpeech(blogContent);

                const contentLength = formattedContent.length;
                let audioKey: string;
                if (contentLength > 2000) {
                    audioKey = await elevenLabsService.uploadObject(formattedContent, storageService, slug);
                } else {
                    audioKey = await deepgramService.uploadObject(formattedContent, storageService, slug);
                }

                if (!audioKey) {
                    console.log(`Failed to generate audio for ${message.body.object.key}`);
                    return;
                }

                const updateStmt = env.DB.prepare(
                    "UPDATE document SET audio_url = ? WHERE id = ?"
                );
                await updateStmt.bind(audioKey, slug).run();

                console.log(`Processed ${message.body.object.key}`);
            })
        );

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(
                    `Failed to process message ${batch.messages[index].body.object.key}:`,
                    result.reason
                );
            }
        });

        console.log(`Completed processing ${batch.messages.length} messages`);
    }
}

export default handler;
