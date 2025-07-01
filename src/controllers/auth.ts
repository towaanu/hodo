import { Hono } from "hono";
import { Bindings } from "@/common/types.ts";
import { auth } from "@/common/auth.ts";

const routes = new Hono<{ Bindings: Bindings }>();

routes.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

export default routes;
