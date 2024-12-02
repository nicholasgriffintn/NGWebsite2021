import { Context, Hono } from 'hono';
import {
  DurableObjectNamespace,
  DurableObjectStub,
} from '@cloudflare/workers-types';
import { createMiddleware } from 'hono/factory';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { Multiplayer } from './multiplayer';
import { handleApiError, AppError } from './utils/errors';
import { BaseResponse as ApiResponse } from './types';

type Env = {
  Bindings: {
    // @ts-ignore
    MULTIPLAYER: DurableObjectNamespace<Multiplayer>;
  };
  Variables: {
    // @ts-ignore
    stub: DurableObjectStub<Multiplayer>;
  };
};

const app = new Hono<Env>();

/**
 * Global middleware to enable CORS
 */
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'https://nicholasgriffin.dev'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

/**
 * Global middleware to log the request method and URL
 */
app.use('*', logger());

/**
 * Home route that displays a welcome message
 * @route GET /
 */
app.get('/', (context: Context) => {
  return context.html(`<h1>Multiplayer API</h1>`);
});

app.get('/status', (c) => c.json({ status: 'ok' }));

const durableObjectMiddleware = createMiddleware<Env>(async (c, next) => {
  const gameId = c.req.query('gameId');

  if (!gameId) {
    throw new AppError('Game ID is required', 400);
  }

  const id = c.env.MULTIPLAYER.idFromName(gameId);
  const stub = c.env.MULTIPLAYER.get(id);
  c.set('stub', stub);

  await next();
});

/**
 * Get users in a game
 * @route GET /anyone-can-draw/users
 */
app.get('/anyone-can-draw/users', durableObjectMiddleware, async (c) => {
  const response = await c.var.stub.fetch(new Request(c.req.url + '/users'));
  const data = (await response.json()) as ApiResponse;

  if (!data.ok) {
    throw new AppError(data.message || 'Unknown error', data.statusCode || 500);
  }

  return c.json(data);
});

/**
 * Join a game
 * @route POST /anyone-can-draw/users
 */
app.post('/anyone-can-draw/users', durableObjectMiddleware, async (c) => {
  const body = await c.req.json();
  const response = await c.var.stub.fetch(
    new Request(c.req.url + '/users', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  );

  const data = (await response.json()) as ApiResponse;

  if (!data.ok) {
    throw new AppError(data.message || 'Unknown error', data.statusCode || 500);
  }

  return c.json(data);
});

/**
 * Get messages
 * @route GET /anyone-can-draw/messages
 */
app.get('/anyone-can-draw/messages', durableObjectMiddleware, async (c) => {
  const response = await c.var.stub.fetch(new Request(c.req.url + '/messages'));
  const data = (await response.json()) as ApiResponse;

  if (!data.ok) {
    throw new AppError(data.message || 'Unknown error', data.statusCode || 500);
  }

  return c.json(data);
});

/**
 * Send a message
 * @route POST /anyone-can-draw/messages
 */
app.post('/anyone-can-draw/messages', durableObjectMiddleware, async (c) => {
  const body = await c.req.json();
  const response = await c.var.stub.fetch(
    new Request(c.req.url + '/messages', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  );
  const data = (await response.json()) as ApiResponse;

  if (!data.ok) {
    throw new AppError(data.message || 'Unknown error', data.statusCode || 500);
  }

  return c.json(data);
});

/**
 * Game actions
 * @route POST /anyone-can-draw/game
 */
app.post('/anyone-can-draw/game', durableObjectMiddleware, async (c) => {
  const body = await c.req.json();
  const response = await c.var.stub.fetch(
    new Request(c.req.url + '/game', {
      method: 'POST',
      body: JSON.stringify(body),
    })
  );
  const data = (await response.json()) as ApiResponse;

  if (!data.ok) {
    throw new AppError(data.message || 'Unknown error', data.statusCode || 500);
  }

  return c.json(data);
});

/**
 * Global error handler
 */
app.onError((err, c) => {
  return handleApiError(err);
});

export { Multiplayer };

export default app;
