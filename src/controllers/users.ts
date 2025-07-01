import { Hono } from "hono";
import { Bindings } from "@/common/types.ts";
import { toUserResponse, userResponseSchema } from "@/views/user.ts";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/valibot";
import { authRequired } from "@/middlewares/auth.ts";
import { AuthType } from "@/common/auth.ts";

const routes = new Hono<{ Bindings: Bindings; Variables: AuthType }>();

routes.get(
  "/me",
  describeRoute({
    description: "Returns info of the current user or error if not logged in",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(userResponseSchema) },
        },
      },
      401: {
        description: "Unauthorized response",
      },
    },
  }),
  authRequired,
  (c) => {
    // const session = c.get("session");
    const user = c.get("user");
    if (!user) {
      return new Response("Server error", { status: 500 });
    }
    return c.json(toUserResponse(user));
  },
);

export default routes;
