import { Kysely, sql } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
// deno-lint-ignore no-explicit-any
export async function up(db: Kysely<any>): Promise<void> {
	// up migration code goes here...
	// note: up migrations are mandatory. you must implement this function.
	// For more info, see: https://kysely.dev/docs/migrations
  await db.schema
    .createTable("todos")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("description", "varchar")
    .addColumn("is_done", "boolean", (col) => col.notNull().defaultTo("false"))
    .addColumn(
      "user_id",
      "varchar",
      (col) => col.references("users.id").onDelete("cascade").notNull(),
    )
    .addColumn(
      "created_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn(
      "updated_at",
      "timestamp",
      (col) => col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
// deno-lint-ignore no-explicit-any
export async function down(db: Kysely<any>): Promise<void> {
	// down migration code goes here...
	// note: down migrations are optional. you can safely delete this function.
	// For more info, see: https://kysely.dev/docs/migrations
}
