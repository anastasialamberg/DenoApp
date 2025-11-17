import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const defaultNow = sql`(cast((julianday('now') - 2440587.5) * 86400000 as integer))`;

export const tasks = sqliteTable('tasks', {
    id: integer('id', { mode: 'number' })
        .primaryKey({ autoIncrement: true }),
    name: text('name')
        .notNull(),
    done: integer('done', { mode: 'boolean' })
        .notNull()
        .default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .default(defaultNow),
    updateAt: integer('update_at', { mode: 'timestamp' })
        .default(defaultNow)
        .$onUpdate(() => new Date()),
});

export const selectTaskSchema = createSelectSchema(tasks);
export const insertTaskSchema = createInsertSchema(tasks, {
    name: schema => schema.min(1).max(500),
})
    .required({
        done: true,
    })
    .omit({
        id: true,
        createdAt: true,
        updateAt: true
    });

export const patchTaskSchema = insertTaskSchema.partial();