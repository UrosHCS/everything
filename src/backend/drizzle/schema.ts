import { boolean, integer, jsonb, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

const id = integer('id').primaryKey().generatedAlwaysAsIdentity();
const createdAt = timestamp('created_at').notNull().defaultNow();

export const bots = pgTable('bots', {
  id,
  name: varchar('name').notNull(),
  description: varchar('description').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  initialMessage: varchar('initial_message').notNull(),
  image: varchar('image').notNull(),
  prompt: varchar('prompt').notNull(),
  slug: varchar('slug').notNull().unique(),
});

export const users = pgTable('users', {
  id,
  name: varchar('name'),
  email: varchar('email').notNull().unique(),
  dob: timestamp('dob'),
  gender: varchar('gender'),
  image: varchar('image'),
  authData: jsonb('auth_data'),
  createdAt,
});

/**
 * A message sent by a user or bot.
 */
export type Message = {
  createdAt: Date;
  body: string;
};

/**
 * A question and answer pair.
 */
export type QnA = {
  question: Message;
  answer?: Message;
};

export const conversations = pgTable('conversations', {
  id,
  botId: integer('bot_id')
    .references(() => bots.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  systemPrompt: varchar('system_prompt').notNull(),
  createdAt,
  messages: jsonb('messages').$type<QnA[]>().notNull().default([]),
});

export type Bot = typeof bots.$inferSelect;
export type BotInsert = typeof bots.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type ConversationInsert = typeof conversations.$inferInsert;
