import { Context, Hono } from 'hono';
import { DurableObjectNamespace } from '@cloudflare/workers-types';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

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
app.get('/anyone-can-draw', async (c: Context) => {
  const gameId = c.req.query('gameId');

  if (!gameId) {
    return new Response('Game ID is required', { status: 400 });
  }

  const upgrade = c.req.header('Upgrade');
  if (!upgrade || upgrade.toLowerCase() !== 'websocket') {
    return new Response('Expected WebSocket connection', { status: 426 });
  }

  const id = c.env.MULTIPLAYER.idFromName(gameId);
  const stub = c.env.MULTIPLAYER.get(id);

  console.log('Fetching game', gameId);
  console.log(c.req.raw);

  return stub.fetch(c.req.raw);
});

/**
 * Health check endpoint
 * @route GET /status
 */
app.get('/status', () => Response.json({ status: 'ok' }));

app.onError((err) => handleApiError(err));

export { Multiplayer };
export default app;
