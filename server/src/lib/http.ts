import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodSchema } from "zod";

/** Wrap an async route handler so thrown errors reach the error middleware. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

/** A request error carrying an HTTP status code. */
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

/** Validate `req.body` against a zod schema, throwing a 400 on failure. */
export function parseBody<T>(schema: ZodSchema<T>, body: unknown): T {
  try {
    return schema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      const msg = err.issues
        .map((i) => `${i.path.join(".") || "field"}: ${i.message}`)
        .join("; ");
      throw new HttpError(400, msg);
    }
    throw err;
  }
}

export const nowIso = () => new Date().toISOString();
