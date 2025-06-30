import { Selectable } from "kysely";
import { User } from "@/db/models.ts";

export interface UserResponse {
  id: number,
  email: string
}

export function toUserResponse(user: Selectable<User>) {
  return {
    id: user.id,
    email: user.email
  }
}
