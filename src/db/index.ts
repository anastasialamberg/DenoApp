import { drizzle } from 'drizzle-orm/sqlite';
import { createClient } from '@libsql/client';
import env from '../env.ts';
import * as schema from "./schema.ts";

const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN
});
const db = drizzle(client, {
    schema,
});

export default db;