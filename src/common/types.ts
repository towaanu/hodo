import type { Result, ResultAsync } from "neverthrow";
import type {AppError} from "@/common/error.ts";

export type Bindings = {
  DATABASE_URL: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_POOL_MAX?: number;
  SERVER_BASE_URL: string
};

export type AppResultAsync<T> = ResultAsync<T, AppError>;
export type AppResult<T> = Result<T, AppError>;
