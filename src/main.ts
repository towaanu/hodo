import { Hono } from "hono";
import helloRoutes from "@/controllers/hello.ts";
import usersRoutes from "@/controllers/users.ts";
import { Bindings } from "@/common/types.ts";

const app = new Hono<{ Bindings: Bindings }>()
  .get("/", (c) => c.text("Hello hodo !"))
  .route("/hello", helloRoutes)
  .route("/api/users", usersRoutes);

Deno.serve(app.fetch);
