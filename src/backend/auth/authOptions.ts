import { db } from '@backend/drizzle/db';
import { users } from '@backend/drizzle/schema';
import { serverConfig } from '@backend/serverConfig';
import { eq } from 'drizzle-orm';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: serverConfig.google.clientId,
      clientSecret: serverConfig.google.clientSecret,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email;

      if (!email) {
        throw new Error('User email is required');
      }

      if (account?.provider !== 'google') {
        return false;
      }

      const authData = JSON.stringify({ user, account, profile });

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, user.email!),
      });

      if (existingUser) {
        await db
          .update(users)
          .set({
            name: user.name,
            image: user.image,
            authData,
          })
          .where(eq(users.id, existingUser.id));

        return true;
      }

      await db.insert(users).values({
        name: user.name,
        email,
        image: user.image,
        authData,
      });

      return true;
    },
  },
};
