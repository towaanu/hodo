import * as z from "zod/v4";
import { Insertable, Selectable } from "kysely";
import { User } from "@/db/models.ts";
import * as bcrypt from "bcrypt";
import { db } from "@/db/index.ts";

export const NewUserSchema = z.object({
  email: z.email(),
  password: z.string().min(5),
});

export async function registerUser(
  newUser: Insertable<User>,
): Promise<Selectable<User>> {
  const userToSave = { ...newUser };
  userToSave.password = await bcrypt.hash(userToSave.password, 10);
  const resWithId = await db.insertInto("users").values(newUser).returning([
    "id",
  ])
    .executeTakeFirst();
  if (!resWithId) {
    throw new Error("No id returned");
  }
  const user = await db.selectFrom("users").selectAll().where(
    "id",
    "=",
    resWithId.id,
  ).executeTakeFirst();

  if (!user) {
    throw new Error("User not found");
  }

  return user as Selectable<User>;
}
