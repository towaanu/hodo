import { Hono } from "hono";
import { NewUserSchema } from "@/models/user.ts";
import { Bindings } from "@/common/types.ts";
import { registerUser } from "@/models/user.ts";
import { appErrorToResponse } from "@/common/error.ts";
import { toUserResponse, userResponseSchema } from "@/views/user.ts";
import { describeRoute } from "hono-openapi";
import { resolver, validator as vValidator } from "hono-openapi/valibot";

const routes = new Hono<{ Bindings: Bindings }>();

routes.post(
  "/",
  describeRoute({
    description: "Register a new user",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(userResponseSchema) },
        },
      },
    },
  }),
  vValidator("json", NewUserSchema),
  async (c) => {
    const newUser = c.req.valid("json");
    const user = await registerUser(newUser);
    if (user.isErr()) {
      return appErrorToResponse(user.error);
    } else {
      return c.json(toUserResponse(user.value));
    }
  },
);

export default routes;
