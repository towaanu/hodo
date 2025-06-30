import * as v from "valibot";
import { Insertable, Selectable } from "kysely";
import { User } from "@/db/models.ts";
import { db } from "@/db/index.ts";
import { Err } from "neverthrow";
import { AppErrorKind } from "@/common/error.ts";
import type { AppResult, AppResultAsync } from "@/common/types.ts";
import { parseResult } from "@/common/valibot.ts";
import { hashPassword } from "@/common/password.ts";

export const NewUserSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(5)),
});

function insertUser(newUser: Insertable<User>): AppResultAsync<number> {
  return db.insertInto("users").values(newUser).returning([
    "id",
  ])
    .executeTakeFirstOrThrow()
    .toAsyncResult((_err) => ({ kind: AppErrorKind.DbError }))
    .map((res) => res.id as number);
}

export function findUserById(id: number): AppResultAsync<Selectable<User>> {
  return db.selectFrom("users").selectAll().where(
    "id",
    "=",
    id,
  ).executeTakeFirst()
    .toAsyncResult((_err) => ({ kind: AppErrorKind.DbError }))
    .map((user) => user as Selectable<User>);
}

export async function registerUser(
  newUser: Insertable<User>,
): Promise<AppResult<Selectable<User>>> {
  const validatedUser = parseResult(NewUserSchema, newUser);
  if (validatedUser.isErr()) {
    return new Err(validatedUser.error);
  }

  const hashedPassword = await hashPassword(validatedUser.value.password);
  if (hashedPassword.isErr()) {
    return new Err(hashedPassword.error);
  }

  const userToInsert = {
    ...validatedUser.value,
    password: hashedPassword.value,
  };

  return insertUser(userToInsert)
    .andThen(findUserById);
}
