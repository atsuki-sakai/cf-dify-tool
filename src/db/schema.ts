import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description').notNull(),
  completed: integer('completed').notNull(),
  due_date: text('due_date').notNull(),
});

export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const chatHistory = sqliteTable('chat_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customer_id: text('customer_id').notNull(),
  user_name: text('user_name').notNull(),
  message: text('message').notNull(),
  response: text('response').notNull(),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reservations = sqliteTable('reservations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  customer_id: text('customer_id').notNull(),
  customer_name: text('customer_name').notNull(),
  service_name: text('service_name').notNull(),
  reservation_date: text('reservation_date').notNull(),
  status: text('status').notNull().default('pending'),
  notes: text('notes'),
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});