import { Hono } from "hono";
import { Bindings } from "@/common/types.ts";
import { appErrorToResponse } from "@/common/error.ts";
import {
  todoResponseSchema,
  todosResponseSchema,
  toTodoResponse,
  toTodosResponse,
} from "@/views/todo.ts";
import { describeRoute } from "hono-openapi";
import { resolver, validator as vValidator } from "hono-openapi/valibot";
import { authRequired } from "@/middlewares/auth.ts";
import { AuthType } from "@/common/auth.ts";
import * as v from "valibot";
import {
  deleteTodoForUser,
  findTodoByIdAndUserId,
  findTodosByUserId,
  insertNewTodoAndGetTodo,
  updateTodoForUser,
} from "@/models/todo.ts";
import { safeParseInt } from "@/common/result.ts";

const routes = new Hono<{ Bindings: Bindings; Variables: AuthType }>();

export const NewTodoParamsSchema = v.object({
  title: v.string(),
  description: v.optional(v.string()),
});

export const UpdateTodoParamsSchema = v.object({
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  isDone: v.optional(v.boolean()),
});

routes.post(
  "/",
  describeRoute({
    description: "Create a new todo",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(todoResponseSchema) },
        },
      },
    },
  }),
  authRequired,
  vValidator("json", NewTodoParamsSchema),
  async (c) => {
    const newTodo = c.req.valid("json");
    const user = c.get("user")!;

    const newTodoForUser = {
      ...newTodo,
      userId: user.id,
    };
    const todo = await insertNewTodoAndGetTodo(newTodoForUser);
    if (todo.isErr()) {
      return appErrorToResponse(todo.error);
    }
    return c.json(toTodoResponse(todo.value));
  },
);

routes.get(
  "/",
  describeRoute({
    description: "Get todos for authenticated user",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(todosResponseSchema) },
        },
      },
    },
  }),
  authRequired,
  async (c) => {
    const user = c.get("user")!;

    const todos = await findTodosByUserId(user.id);
    if (todos.isErr()) {
      return appErrorToResponse(todos.error);
    }
    return c.json(toTodosResponse(todos.value));
  },
);

routes.get(
  "/:id",
  describeRoute({
    description: "Get a todo by id for current authenticated user",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(todoResponseSchema) },
        },
      },
    },
  }),
  authRequired,
  async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const todoId = safeParseInt(id);
    if (todoId.isErr()) {
      return appErrorToResponse(todoId.error);
    }

    const todo = await findTodoByIdAndUserId(todoId.value, user.id);
    if (todo.isErr()) {
      return appErrorToResponse(todo.error);
    }

    return c.json(toTodoResponse(todo.value));
  },
);

routes.put(
  "/:id",
  describeRoute({
    description: "Update a todo by id for current authenticated user",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(todoResponseSchema) },
        },
      },
    },
  }),
  authRequired,
  vValidator("json", UpdateTodoParamsSchema),
  async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const todoId = safeParseInt(id);
    const updatedTodo = c.req.valid("json");

    if (todoId.isErr()) {
      return appErrorToResponse(todoId.error);
    }

    const todo = await updateTodoForUser(todoId.value, updatedTodo, user.id);
    if (todo.isErr()) {
      return appErrorToResponse(todo.error);
    }

    return c.json(toTodoResponse(todo.value));
  },
);

routes.delete(
  "/:id",
  describeRoute({
    description: "Delete a todo by id",
    responses: {
      200: {
        description: "Successful response",
      },
    },
  }),
  authRequired,
  async (c) => {
    const user = c.get("user")!;
    const { id } = c.req.param();
    const todoId = safeParseInt(id);
    if (todoId.isErr()) {
      return appErrorToResponse(todoId.error);
    }

    const deleteRes = await deleteTodoForUser(todoId.value, user.id);
    if (deleteRes.isErr()) {
      return appErrorToResponse(deleteRes.error);
    }

    return c.json({});
  },
);

export default routes;
