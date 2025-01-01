import { authOptions } from '@backend/auth/authOptions';
import { getServerSession } from 'next-auth/next';

export function getServerSideSession() {
  return getServerSession(authOptions);
}
