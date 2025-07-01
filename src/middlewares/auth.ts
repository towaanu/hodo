import { auth } from "@/common/auth.ts";
import { createMiddleware } from "hono/factory";
import { AppErrorKind, appErrorToResponse } from "@/common/error.ts";
import { AppResult } from "@/common/types.ts";
import { Err, Ok } from "neverthrow";

function unauthorizeIfNoSession<T>(
  session: T | undefined | null,
): AppResult<T> {
  if (!session) {
    return new Err({ kind: AppErrorKind.Unauthorized });
  } else {
    return new Ok(session);
  }
}

export const authRequired = createMiddleware(
  async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
      .toAsyncResult((_err) => ({
        kind: AppErrorKind.Unauthorized,
      }))
      .andThen(unauthorizeIfNoSession);

    // Returns Unauthorized response if no err
    if (session.isErr()) {
      return appErrorToResponse(session.error);
    }

    c.set("user", session.value.user);
    c.set("session", session.value.session);
    return next();
  },
);
