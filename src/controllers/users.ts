import { Hono } from "hono";
import { NewUserSchema } from "@/models/user.ts";
import { zValidatorWrapper } from "@/common/zod.ts";
import { Bindings } from "@/common/types.ts";
import { registerUser } from "@/models/user.ts";
import { appErrorToResponse } from "@/common/error.ts";

const routes = new Hono<{ Bindings: Bindings }>();

// routes.post("/", zValidatorWrapper("json", NewUserSchema), async (c) => {
//   const newUser = c.req.valid("json");
//   try {
//     const user = await registerUser(newUser);
//     return c.json({ user });
//   } catch (e) {
//     console.error(e);
//     throw new HTTPException(400, { message: "Unable to register new user" });
//   }
// });

routes.post("/", zValidatorWrapper("json", NewUserSchema), async (c) => {
  const newUser = c.req.valid("json");
  const user = await registerUser(newUser);
  if (user.isErr()) {
    return appErrorToResponse(user.error);
  } else {
    return c.json(user.value);
  }
});

export default routes;
