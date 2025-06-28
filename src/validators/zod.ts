import { ZodSchema } from "zod/v4";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

export function zValidatorWrapper<
  T extends ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) {
  return zv(target, schema, (result, _c) => {
    if (!result.success) {
      throw new HTTPException(400, { message: result.error.message });
    }
  });
}
