import { Hono } from "hono";
import helloRoutes from "./controllers/hello.ts";
import usersRoutes from "./controllers/users.ts";

type Bindings = {
  DATABASE_URL: string;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_POOL_MAX?: number;
};

const app = new Hono<{ Bindings: Bindings }>()
  .get("/", (c) => c.text("Hello hodo !"))
  .route("/hello", helloRoutes)
  .route("/api/users", usersRoutes);

Deno.serve(app.fetch);
