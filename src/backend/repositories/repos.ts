import { Repository } from './Repository';
import { Bot, Conversation, User } from '@lib/firebase/models';

export const repos = {
  bots: new Repository<Bot>('bots'),
  conversations: new Repository<Conversation>('conversations'),
  users: new Repository<User>('users'),
};
