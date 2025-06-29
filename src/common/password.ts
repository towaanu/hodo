import type { AppResultAsync } from "@/common/types.ts";
import { AppErrorKind } from "@/common/error.ts";
import * as bcrypt from "bcrypt";

export function hashPassword(password: string): AppResultAsync<string> {
  return bcrypt.hash(password, 10)
    .toAsyncResult((_err: unknown) => ({ kind: AppErrorKind.Bcrypt }));
}
