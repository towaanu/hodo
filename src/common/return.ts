// import { Err, Ok, ResultAsync as NtResultAsync } from "neverthrow";
// import { AppError, AppErrorKind } from "@/common/error.ts";
//
// export class ResultAsync<T> extends NtResultAsync<T, AppError> {
//
//   static override fromPromise<T, AppError>(promise: PromiseLike<T>, errorFn: (e: unknown) => AppError): ResultAsync<T>
//
//   static override fromPromise<T, AppError>(
//     promise: Promise<T>,
//     errorFn: (e: unknown) => AppError,
//   ): ResultAsync<T> {
//     const newPromise = promise
//       .then((value: T) => new Ok<T, AppError>(value))
//       .catch((e) => new Err<T, AppError>(errorFn(e)));
//
//     return new ResultAsync(newPromise);
//   }
// }
