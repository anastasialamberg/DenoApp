import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";
import env from "../env.ts";

export async function migrateTestDb() {
  const client = createClient({ url: env.DATABASE_URL });
  const db = drizzle(client);

  await migrate(db, { migrationsFolder: "./src/db/migrations" });

  client.close();
}
