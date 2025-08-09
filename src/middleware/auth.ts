import type { MiddlewareHandler } from 'hono';

export const requireBearer: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization') ?? '';

  const EXPECTED_BEARER = `Bearer ${c.env.APIKEY}`;

  if (authHeader !== EXPECTED_BEARER) {
    return c.json(
      {
        success: false,
        errors: [
          {
            code: 4010,
            message: 'Unauthorized',
          },
        ],
      },
      401,
    );
  }

  return next();
};
