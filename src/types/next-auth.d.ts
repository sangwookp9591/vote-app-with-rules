import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      nickname?: string;
      profileImageUrl?: string;
      role?: string;
    } & DefaultSession['user'];
  }
  interface User {
    id: string;
    email: string;
    nickname?: string;
    profileImageUrl?: string | null;
    role?: string;
  }
}
