import { Hono } from "hono";

const routes = new Hono();

routes.get("/", (c) => {
  return c.text("Hello Hono!");
});

routes.get("/:name", (c) => {
  const name = c.req.param("name");
  return c.text(`Hello ${name}!`);
});

export default routes;
