import { Conversation } from '@backend/drizzle/schema';
import { useReducer } from 'react';

type Action =
  | {
      type: 'addQuestion';
      payload: string;
    }
  | {
      type: 'addAnswer';
      payload: string;
    }
  | {
      type: 'undoQuestion';
    };

export type ClientConversation = Pick<Conversation, 'id' | 'createdAt' | 'messages'>;

type UnauthenticatedClientConversation = Pick<Conversation, 'messages'> & {
  id: null;
  createdAt: null | Conversation['createdAt'];
};

export type ConversationState = ClientConversation | UnauthenticatedClientConversation;

function reducer(state: ConversationState, action: Action): ConversationState {
  const now = new Date();

  switch (action.type) {
    case 'addQuestion':
      const message = { question: { body: action.payload, createdAt: now } };

      return {
        ...state,
        createdAt: state.createdAt ?? now,
        messages: [...state.messages, message],
      };
    case 'undoQuestion':
      return {
        ...state,
        messages: state.messages.slice(0, -1),
      };
    case 'addAnswer':
      const newMessages = [...state.messages];
      newMessages[newMessages.length - 1].answer = { body: action.payload, createdAt: now };
      return {
        ...state,
        messages: newMessages,
      };
  }
}

export function useConversation(initialConversation?: ConversationState) {
  const [conversation, dispatch] = useReducer(reducer, initialConversation ?? generateUnauthenticatedConversation());

  return {
    conversation,
    addQuestion: (question: string) => dispatch({ type: 'addQuestion', payload: question }),
    undoQuestion: () => dispatch({ type: 'undoQuestion' }),
    addAnswer: (answer: string) => dispatch({ type: 'addAnswer', payload: answer }),
  };
}

function generateUnauthenticatedConversation(): UnauthenticatedClientConversation {
  return {
    id: null,
    createdAt: null,
    messages: [],
  };
}
