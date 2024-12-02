import { Context, Hono } from 'hono';
import { DurableObjectNamespace } from '@cloudflare/workers-types';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { upgradeWebSocket } from 'hono/cloudflare-workers';

import { Multiplayer } from './multiplayer';
import { handleApiError } from './utils/errors';

type Env = {
  Bindings: {
    // @ts-ignore
    MULTIPLAYER: DurableObjectNamespace<Multiplayer>;
  };
};

const app = new Hono<Env>();

app.use('*', cors());
app.use('*', logger());

/**
 * WebSocket handler for game connections
 * @route GET /anyone-can-draw
 */
app.get(
  '/anyone-can-draw',
  upgradeWebSocket((c: Context) => {
    const gameId = c.req.query('gameId');

    if (!gameId) {
      throw new Error('Game ID is required');
    }

    const id = c.env.MULTIPLAYER.idFromName(gameId);
    const stub = c.env.MULTIPLAYER.get(id);

    return stub.fetch(c.req.raw);
  })
);

/**
 * Health check endpoint
 * @route GET /status
 */
app.get('/status', () => Response.json({ status: 'ok' }));

app.onError((err) => handleApiError(err));

export { Multiplayer };
export default app;
