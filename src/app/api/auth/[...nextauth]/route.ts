import { config } from '../../../../config';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [GoogleProvider(config.google)],
});

export { handler as GET, handler as POST };
