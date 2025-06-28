import { Hono } from "hono";
import { Insertable } from "kysely";
import { User } from "../db/db.d.ts";
import { db } from "../db/index.ts";
import { HTTPException } from "hono/http-exception";

const routes = new Hono();

routes.post("/", async (c) => {
  const newUser = await c.req.json<Insertable<User>>();
  try {
    const res = await db.insertInto("users").values(newUser).returning(["id"])
      .executeTakeFirst();

    if (!res) {
      throw new Error("No id returned");
    }

    return c.json({ id: res.id });
  } catch (e) {
    console.error(e);
    throw new HTTPException(400, { message: "Unable to register new user" });
  }
});

export default routes;
