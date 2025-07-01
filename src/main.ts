import { Hono } from "hono";
import { cors } from "hono/cors";
import helloRoutes from "@/controllers/hello.ts";
import usersRoutes from "@/controllers/users.ts";
import authRoutes from "@/controllers/auth.ts";
import todosRoutes from "@/controllers/todos.ts";
import { Bindings } from "@/common/types.ts";
import { openAPISpecs } from "hono-openapi";
import "@/common/promise.ts";
import { Scalar } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";

const app = new Hono<{ Bindings: Bindings }>();
app.use("/api/*", cors());
app.use(logger());

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Hodo API",
        version: "0.1",
        description: "Todo API",
      },
      servers: [
        {
          url: Deno.env.get("SERVER_BASE_URL") ?? "",
          description: "hodo open api server",
        },
      ],
    },
  }),
).get(
  "/",
  Scalar({
    theme: "saturn",
    url: "/openapi",
  }),
);

app
  .route("/hello", helloRoutes)
  .route("/api/users", usersRoutes)
  .route("/api/auth", authRoutes)
  .route("/api/todos", todosRoutes);

Deno.serve(app.fetch);
