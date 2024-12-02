import { Context, Hono } from 'hono';
import { DurableObjectNamespace } from '@cloudflare/workers-types';

import { Multiplayer } from './multiplayer';
import { handleApiError } from './utils/errors';

type Env = {
  Bindings: {
    // @ts-ignore
    MULTIPLAYER: DurableObjectNamespace<Multiplayer>;
  };
};

const app = new Hono<Env>();

/**
 * WebSocket handler for game connections
 * @route GET /anyone-can-draw
 */
app.get('/anyone-can-draw', async (c: Context) => {
  const gameId = c.req.query('gameId');

  const upgradeHeader = c.req.raw.headers.get('Upgrade');
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Durable Object expected Upgrade: websocket', {
      status: 426,
    });
  }

  const id = c.env.MULTIPLAYER.idFromName(gameId);
  const stub = c.env.MULTIPLAYER.get(id);

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