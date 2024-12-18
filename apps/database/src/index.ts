import { D1Database } from '@cloudflare/workers-types';

import schema from './schema';

export interface Env {
	DB: D1Database;
}

export { schema };
