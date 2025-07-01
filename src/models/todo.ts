import * as v from "valibot";
import { DeleteResult, Insertable, Selectable, Updateable } from "kysely";
import { Todo } from "@/db/models.ts";
import { db } from "@/db/index.ts";
import { Err, errAsync } from "neverthrow";
import { AppErrorKind } from "@/common/error.ts";
import type { AppResult, AppResultAsync } from "@/common/types.ts";
import { parseResult } from "@/common/valibot.ts";

export const NewTodoSchema = v.object({
  title: v.string(),
  description: v.optional(v.string()),
  userId: v.string(),
});

function insertTodo(newTodo: Insertable<Todo>): AppResultAsync<number> {
  const validatedTodo = parseResult(NewTodoSchema, newTodo);
  if (validatedTodo.isErr()) {
    return errAsync(validatedTodo.error);
  }

  return db.insertInto("todos").values(validatedTodo.value).returning([
    "id",
  ])
    .executeTakeFirstOrThrow()
    .toAsyncResult((_err) => ({ kind: AppErrorKind.DbError }))
    .map((res) => res.id as number);
}

export function findTodoByIdAndUserId(
  id: number,
  userId: string,
): AppResultAsync<Selectable<Todo>> {
  return db.selectFrom("todos").selectAll().where((eb) =>
    eb.and({
      id,
      userId,
    })
  ).executeTakeFirst()
    .toAsyncResult((_err) => ({ kind: AppErrorKind.DbError }))
    .map((todo) => todo as Selectable<Todo>);
}

export function findTodoById(
  id: number,
): AppResultAsync<Selectable<Todo>> {
  return db.selectFrom("todos").selectAll().where("id", "=", id)
    .executeTakeFirst()
    .toAsyncResult((_err) => ({ kind: AppErrorKind.DbError }))
    .map((todo) => todo as Selectable<Todo>);
}

export function findTodosByUserId(
  userId: string,
): AppResultAsync<Array<Selectable<Todo>>> {
  return db.selectFrom("todos").selectAll().where("userId", "=", userId)
    .execute()
    .toAsyncResult((_err) => ({ kind: AppErrorKind.DbError }));
}

export async function updateTodoForUser(
  todoId: number,
  todo: Updateable<Todo>,
  userId: string,
): Promise<AppResult<Selectable<Todo>>> {
  const updateRes = await db.updateTable("todos")
    .set(todo)
    .where((eb) =>
      eb.and({
        id: todoId,
        userId,
      })
    ).executeTakeFirstOrThrow()
    .toAsyncResult((_err) => ({ kind: AppErrorKind.DbError }));

  if (updateRes.isErr()) {
    return new Err(updateRes.error);
  }

  return findTodoById(todoId);
}

export function deleteTodoForUser(
  id: number,
  userId: string,
): AppResultAsync<DeleteResult> {
  return db.deleteFrom("todos").where((eb) =>
    eb.and({
      id,
      userId,
    })
  ).executeTakeFirstOrThrow()
    .toAsyncResult((_err) => ({ kind: AppErrorKind.DbError }));
}

export function insertNewTodoAndGetTodo(
  newTodo: Insertable<Todo>,
): AppResultAsync<Selectable<Todo>> {
  return insertTodo(newTodo)
    .andThen(findTodoById);
}
