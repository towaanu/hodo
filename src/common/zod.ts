import { ZodError, ZodSchema } from "zod/v4";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import type { AppResult } from "@/common/types.ts";
import { AppErrorKind } from "@/common/error.ts";
import { Result } from "neverthrow";

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

export function parseResult<T>(
  schema: ZodSchema<T, T>,
  value: T,
): AppResult<T> {
  return Result.fromThrowable(
    () => schema.parse(value),
    (err: unknown) => ({
      kind: AppErrorKind.Zod,
      messages: (err as ZodError<T>).issues.map((e) => e.message),
    }),
  )();
}
