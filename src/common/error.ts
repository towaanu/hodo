export enum AppErrorKind {
  DbError,
  ModelNotFound,
  Bcrypt,
  Valibot,
}

export type AppError =
  | { kind: AppErrorKind.DbError; message?: string }
  | { kind: AppErrorKind.ModelNotFound; message?: string }
  | { kind: AppErrorKind.Bcrypt; message?: string }
  | { kind: AppErrorKind.Valibot; messages: Array<string> };

export function appErrorToResponse(appError: AppError): Response {
  switch (appError.kind) {
    case AppErrorKind.DbError:
      return new Response("Server error", { status: 500 });

    case AppErrorKind.ModelNotFound:
      return new Response(appError.message ?? "Not found", { status: 404 });

    case AppErrorKind.Bcrypt:
      return new Response("Server error", { status: 500 });

    case AppErrorKind.Valibot:
      return new Response("Wrong item", { status: 400 });

    default:
      return new Response("Server error", { status: 500 });
  }
}
