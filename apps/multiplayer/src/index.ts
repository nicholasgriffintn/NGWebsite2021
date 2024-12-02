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
  const response = await c.var.stub.fetch(
    new Request(c.req.url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getUsers',
      }),
    })
  );
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
  const clonedRequest = c.req.raw.clone();
  const body = await clonedRequest.json();

  const response = await c.var.stub.fetch(
    new Request(c.req.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'join',
        data: body,
      }),
    })
  );

  const data = (await response.json()) as ApiResponse;

  if (!data.ok) {
    throw new AppError(data.message || 'Unknown error', data.statusCode || 500);
  }

  return c.json(data);
});

/**
 * Leave a game
 * @route DELETE /anyone-can-draw/users
 */
app.delete('/anyone-can-draw/users', durableObjectMiddleware, async (c) => {
  const response = await c.var.stub.fetch(
    new Request(c.req.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'leave',
      }),
    })
  );
  const data = (await response.json()) as ApiResponse;

  if (!data.ok) {
    throw new AppError(data.message || 'Unknown error', data.statusCode || 500);
  }

  return c.json(data);
});

/**
 * Get game state
 * @route GET /anyone-can-draw/game
 */
app.get('/anyone-can-draw/game', durableObjectMiddleware, async (c) => {
  const response = await c.var.stub.fetch(
    new Request(c.req.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'getState',
      }),
    })
  );
  const data = (await response.json()) as ApiResponse;

  if (!data.ok) {
    throw new AppError(data.message || 'Unknown error', data.statusCode || 500);
  }

  return c.json(data);
});

/**
 * @route POST /anyone-can-draw/game
 */
app.post('/anyone-can-draw/game', durableObjectMiddleware, async (c) => {
  const body = await c.req.json();

  const action = body.action;

  if (!action) {
    throw new AppError('Action is required', 400);
  }

  const response = await c.var.stub.fetch(
    new Request(c.req.url, {
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
