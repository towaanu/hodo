import type { AppResult } from "@/common/types.ts";
import { AppErrorKind } from "@/common/error.ts";
import { Result } from "neverthrow";
import { BaseIssue, BaseSchema, InferOutput, parse, ValiError } from "valibot";

export function parseResult<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  schema: TSchema,
  input: unknown,
): AppResult<InferOutput<TSchema>> {
  return Result.fromThrowable(
    () => parse(schema, input),
    (err: unknown) => ({
      kind: AppErrorKind.Valibot,
      messages: (err as ValiError<TSchema>).issues.map((e) => e.message),
    }),
  )();
}
