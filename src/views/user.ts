import { Selectable } from "kysely";
import { User } from "@/db/models.ts";
import * as v from "valibot";
import { AuthType } from "@/common/auth.ts";

export const userResponseSchema = v.object({
  id: v.number(),
  email: v.pipe(v.string(), v.email()),
})

export interface UserResponse {
  id: number;
  email: string;
}

export function toUserResponse(user: NonNullable<AuthType["user"]>) {
  return {
    id: user.id,
    email: user.email,
  };
}
