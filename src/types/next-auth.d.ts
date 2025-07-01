import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      nickname?: string;
      profileImageUrl?: string;
      role?: string;
    } & DefaultSession['user'];
  }
  interface User {
    email: string;
    nickname?: string;
    profileImageUrl?: string | null;
    role?: string;
  }
}
