import { Timestamp } from 'firebase/firestore';

/**
 * AI Bot that has a personality and can converse with users.
 */
export type Bot = {
  description: string;
  enabled: boolean;
  initialMessage: string;
  image: string;
  name: string;
  prompt: string;
  slug: string;
};

/**
 * A message sent by a user or bot.
 */
export type Message = {
  createdAt: string;
  body: string;
};

/**
 * A question and answer pair, consisting of two messages
 */
export type QnA = {
  answer?: Message;
  question: Message;
};

/**
 * A conversation between a user and a bot.
 */
export type Conversation = {
  botId: string;
  createdAt: string;
  messages: QnA[];
  systemPrompt: string;
  userId: string;
};

/**
 * A user of the application.
 */
export type User = {
  name: string;
  dob: Timestamp;
  gender: string;
  image: string;
  createdAt: string;
};
