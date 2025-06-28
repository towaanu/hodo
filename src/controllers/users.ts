import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { NewUserSchema } from "@/models/user.ts";
import { zValidatorWrapper } from "@/validators/zod.ts";
import { Bindings } from "@/common/types.ts";
import { registerUser } from "@/models/user.ts";

const routes = new Hono<{ Bindings: Bindings }>();

routes.post("/", zValidatorWrapper("json", NewUserSchema), async (c) => {
  const newUser = c.req.valid("json");
  try {
    const user = await registerUser(newUser);
    return c.json({ user });
  } catch (e) {
    console.error(e);
    throw new HTTPException(400, { message: "Unable to register new user" });
  }
});

export default routes;
