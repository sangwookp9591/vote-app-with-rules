import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { Session, User } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';

type JWT = DefaultJWT & {
  id?: string;
  nickname?: string;
  profileImageUrl?: string;
};

const prisma = new PrismaClient();

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'email', placeholder: 'your@email.com' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const email = credentials?.email as string;
          const password = credentials?.password as string;

          if (!email || !password) {
            console.log('Credentials missing');
            return null;
          }

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            console.log('User not found:', email);
            return null;
          }

          if (!user.password) {
            console.log('User has no password (social login user)');
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            console.log('Invalid password for user:', email);
            return null;
          }

          // next-auth 세션에 저장할 유저 정보
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            profileImageUrl: user.profileImageUrl ?? undefined,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }: { session: Session; token: JWT; user?: User }) {
      if (session.user) {
        session.user.id = user?.id ?? token.id ?? '';
        session.user.nickname = user?.nickname ?? token.nickname;
        session.user.profileImageUrl = user?.profileImageUrl ?? token.profileImageUrl;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.nickname = user.nickname;
        token.profileImageUrl = user.profileImageUrl ?? undefined;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  // 필요시 callbacks, adapter 등 추가
};

export const { handlers, auth, signOut } = NextAuth(authConfig);
