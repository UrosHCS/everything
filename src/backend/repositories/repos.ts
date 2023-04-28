import { Repository } from './Repository';

type Bot = {
  description: string;
  enabled: boolean;
  image: string;
  name: string;
  prompt: string;
};

type Message = {
  createdAt: string;
  body: string;
};

type QnA = {
  answer?: Message;
  question: Message;
};

type Conversation = {
  botId: string;
  createdAt: string;
  qna: QnA[];
  userId: string;
};

type User = {
  name: string;
  dob: string;
  gender: string;
  image: string;
  createdAt: string;
};

export const repos = {
  bots: new Repository<Bot>('bots'),
  conversations: new Repository<Conversation>('conversations'),
  users: new Repository<User>('users'),
};
