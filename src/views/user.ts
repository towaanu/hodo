import { Selectable } from "kysely";
import { User } from "@/db/models.ts";
import * as v from "valibot";

export const userResponseSchema = v.object({
  id: v.number(),
  email: v.pipe(v.string(), v.email()),
})

export interface UserResponse {
  id: number;
  email: string;
}

export function toUserResponse(user: Selectable<User>) {
  return {
    id: user.id,
    email: user.email,
  };
}
