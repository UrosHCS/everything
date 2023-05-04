export type Bot = {
  description: string;
  enabled: boolean;
  image: string;
  name: string;
  prompt: string;
};

export type Message = {
  createdAt: string;
  body: string;
};

export type QnA = {
  answer?: Message;
  question: Message;
};

export type Conversation = {
  botId: string;
  createdAt: string;
  messages: QnA[];
  userId: string;
};

export type User = {
  name: string;
  dob: string;
  gender: string;
  image: string;
  createdAt: string;
};
