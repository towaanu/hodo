export enum AppErrorKind {
  DbError,
  ModelNotFound,
  Bcrypt,
  Valibot,
  Unauthorized,
  Params,
  Parse,
}

export type AppError =
  | { kind: AppErrorKind.DbError; message?: string }
  | { kind: AppErrorKind.ModelNotFound; message?: string }
  | { kind: AppErrorKind.Bcrypt; message?: string }
  | { kind: AppErrorKind.Unauthorized; message?: string }
  | { kind: AppErrorKind.Params; message?: string }
  | { kind: AppErrorKind.Parse }
  | { kind: AppErrorKind.Valibot; messages: Array<string> };

export function appErrorToResponse(appError: AppError): Response {
  switch (appError.kind) {
    case AppErrorKind.DbError:
      return new Response("Server error", { status: 500 });

    case AppErrorKind.ModelNotFound:
      return new Response(appError.message ?? "Not found", { status: 404 });

    case AppErrorKind.Params:
      return new Response(appError.message ?? "Wrong parameters", {
        status: 400,
      });

    case AppErrorKind.Parse:
      return new Response("Parse error", { status: 400 });

    case AppErrorKind.Bcrypt:
      return new Response("Server error", { status: 500 });

    case AppErrorKind.Valibot:
      return new Response("Wrong item", { status: 400 });

    case AppErrorKind.Unauthorized:
      return new Response("Unauthorized", { status: 401 });

    default:
      return new Response("Server error", { status: 500 });
  }
}
