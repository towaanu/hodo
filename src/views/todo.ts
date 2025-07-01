import { Selectable } from "kysely";
import { Todo } from "@/db/models.ts";
import * as v from "valibot";

export const todoResponseSchema = v.object({
  id: v.number(),
  title: v.string(),
  isDone: v.boolean(),
  description: v.optional(v.string()),
});

export const todosResponseSchema = v.array(todoResponseSchema);

export interface TodoResponse {
  id: number;
  title: string;
  description?: string | null;
  isDone: boolean;
}

export function toTodoResponse(todo: Selectable<Todo>): TodoResponse {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    isDone: todo.isDone,
  };
}

export type TodosResponse = Array<TodoResponse>;

export function toTodosResponse(todos: Array<Selectable<Todo>>): TodosResponse {
  return todos.map(toTodoResponse);
}
