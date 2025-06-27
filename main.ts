import { Hono } from "hono";
import helloRoutes from "./controllers/hello.ts";

const app = new Hono()
  .get("/", (c) => c.text("Hello hodo !"))
  .route("/hello", helloRoutes);

Deno.serve(app.fetch);
