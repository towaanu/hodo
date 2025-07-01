import { Kysely, sql } from "kysely";

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
// deno-lint-ignore no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
  // up migration code goes here...
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations
  await db.schema.alterTable("users")
    .addColumn("name", "varchar", (col) => col.notNull().unique())
    .addColumn(
      "email_verified",
      "boolean",
      (col) => col.defaultTo("false").notNull(),
    )
    .addColumn("image", "varchar")
    .addColumn(
      "updated_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    ).execute();

  await db.schema
    .createTable("session")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn(
      "user_id",
      "varchar",
      (col) => col.references("users.id").onDelete("cascade").notNull(),
    )
    .addColumn("token", "varchar", (col) => col.notNull())
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .addColumn("ip_address", "varchar")
    .addColumn("user_agent", "varchar")
    .addColumn(
      "created_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    ).addColumn(
      "updated_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    ).execute();

  await db.schema
    .createTable("account")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn(
      "user_id",
      "varchar",
      (col) => col.references("users.id").onDelete("cascade").notNull(),
    )
    .addColumn("account_id", "varchar", (col) => col.notNull())
    .addColumn("provider_id", "varchar", (col) => col.notNull())
    .addColumn("access_token", "varchar")
    .addColumn("refresh_token", "varchar")
    .addColumn("access_token_expires_at", "timestamp")
    .addColumn("refresh_token_expires_at", "timestamp")
    .addColumn("scope", "varchar")
    .addColumn("id_token", "varchar")
    .addColumn("password", "varchar")
    .addColumn(
      "created_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    ).addColumn(
      "updated_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    ).execute();

  await db.schema
    .createTable("verification")
    .addColumn("id", "varchar", (col) => col.primaryKey())
    .addColumn("identifier", "varchar", (col) => col.notNull())
    .addColumn("value", "varchar", (col) => col.notNull())
    .addColumn("expires_at", "timestamp", (col) => col.notNull())
    .addColumn(
      "created_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    ).addColumn(
      "updated_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    ).execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
// deno-lint-ignore no-explicit-any
export async function down(_db: Kysely<any>): Promise<void> {
  // down migration code goes here...
  // note: down migrations are optional. you can safely delete this function.
  // For more info, see: https://kysely.dev/docs/migrations
}
