import { ResultAsync } from "neverthrow";
import { AppError } from "@/common/error.ts";

type AppErrorFn = (e: unknown) => AppError;

declare global {
  interface Promise<T> {
    toAsyncResult(errorFn: AppErrorFn): ResultAsync<T, AppError>;
  }
}

Promise.prototype.toAsyncResult = function (errorFn: AppErrorFn) {
  return ResultAsync.fromPromise(this, errorFn);
};
