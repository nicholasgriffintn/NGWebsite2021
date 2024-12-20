export class StorageService {
    constructor(private readonly bucket: R2Bucket) {}

    async getObject(key: string): Promise<string | null> {
        try {
            const object = await this.bucket.get(key);
            if (!object) {
                return null;
            }
            return await object.text();
        } catch (error) {
            console.error(`Error fetching object ${key}:`, error);
            throw new Error(`Failed to fetch object: ${key}`);
        }
    }
}