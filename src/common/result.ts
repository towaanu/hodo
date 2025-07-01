import { fromThrowable, Result } from "neverthrow";
import { AppErrorKind } from "@/common/error.ts";
type SafeParseIntFun = (
  s: string,
  radix?: number | undefined,
) => Result<number, { kind: AppErrorKind.Parse }>;
export const safeParseInt: SafeParseIntFun = fromThrowable(
  parseInt,
  () => ({ kind: AppErrorKind.Parse }),
);
