import { User, auth } from '.';
import { onAuthStateChanged } from 'firebase/auth';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

type Session =
  | {
      status: 'loading';
      user: null;
    }
  | {
      status: 'authenticated';
      user: User;
    }
  | {
      status: 'unauthenticated';
      user: null;
    };

export const FirebaseSessionContext = createContext<Session>({
  status: 'loading',
  user: null,
});

export function useSession() {
  return useContext(FirebaseSessionContext);
}

type Props = {
  children: ReactNode;
};

export function FirebaseSessionProvider({ children }: Props) {
  const [session, setSession] = useState<Session>(createSession(auth.currentUser, 'loading'));

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setSession(createSession(user, 'unauthenticated'));

      if (!user) return;

      /** @todo real time stuff */
    });
  }, []);

  return <FirebaseSessionContext.Provider value={session}>{children}</FirebaseSessionContext.Provider>;
}

function createSession(user: User | null, fallbackStatus: 'loading' | 'unauthenticated'): Session {
  if (!user) {
    return { status: fallbackStatus, user: null };
  }

  return { status: 'authenticated', user };
}
