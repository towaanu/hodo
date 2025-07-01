import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import type { DB } from "./models.ts";
import { Pool } from "pg";

export type HodoKysely = Kysely<DB>;

const dialect = new PostgresDialect({
  pool: new Pool({
    database: Deno.env.get("DATABASE_NAME"),
    host: Deno.env.get("DATABASE_HOST"),
    user: Deno.env.get("DATABASE_USER"),
    password: Deno.env.get("DATABASE_PASSWORD"),
    port: Deno.env.get("DATABASE_PORT"),
    max: parseInt(Deno.env.get("DATABASE_POOL_MAX") ?? "10"),
  }),
});

export const db = new Kysely<DB>({ dialect, plugins: [new CamelCasePlugin()] });
