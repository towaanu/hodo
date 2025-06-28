import { PostgresDialect } from "kysely";
import Pool from "pg-pool";
import { defineConfig } from "kysely-ctl";

export default defineConfig({
  // replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
  dialect: new PostgresDialect({
    pool: new Pool({
      database: "hodo",
      host: "localhost",
      port: 5999,
      user: "hodo",
      password: "secret",
      max: 10,
    }),
  }),
  migrations: {
    migrationFolder: "migrations",
  },
  //   plugins: [],
  //   seeds: {
  //     seedFolder: "seeds",
  //   }
});
