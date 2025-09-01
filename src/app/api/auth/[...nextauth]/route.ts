// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { dbConnect } from '@/lib/mongodb';
import SessionModel from '@/lib/models/session';
import UserModel from '@/lib/models/user';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'test@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          await dbConnect();
          const user = await UserModel.findOne({ email: credentials.email });

          if (!user || !user.isEmailVerified) {
            return null;
          }

          // Handle 2FA verified login
          if (credentials.password === 'verified' && user.role === 'admin') {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }

          // Regular password verification
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            return null;
          }

          // Check if admin needs 2FA based on website settings
          if (user.role === 'admin') {
            try {
              const { WebsiteSettings } = require('@/lib/models/websiteSettings');
              const settings = await WebsiteSettings.findOne({ isActive: true });
              if (settings?.security?.enableTwoFactor) {
                throw new Error('2FA_REQUIRED');
              }
            } catch (error) {
              if (error instanceof Error && error.message === '2FA_REQUIRED') {
                throw error;
              }
              console.error('Error checking 2FA settings:', error);
            }
          }

          const session = new SessionModel({
            userId: user._id,
            ipAddress: req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress,
            userAgent: req.headers?.['user-agent'],
          });
          await session.save();

          user.sessions.push(session._id);
          await user.save();

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            sessionId: session._id.toString(),
          };
        } catch (error) {
          console.error('Auth error:', error);
          if (error instanceof Error && error.message === '2FA_REQUIRED') {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.name = (user as any).name;
        token.role = (user as any).role;
        
        // Ensure sessionId is set
        if ((user as any).sessionId) {
          token.sessionId = (user as any).sessionId;
          console.log('Setting sessionId in JWT:', (user as any).sessionId);
        }
      }

      // Handle session updates (when update() is called)
      if (trigger === 'update' && session) {
        if (session.name) {
          token.name = session.name;
        }
        if (session.email) {
          token.email = session.email;
        }
        if (session.role) {
          token.role = session.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).email = token.email;
        (session.user as any).name = token.name;
        (session.user as any).role = token.role;
        
        if (token.sessionId) {
          (session.user as any).sessionId = token.sessionId;
          console.log('Setting sessionId in session:', token.sessionId);
        } else {
          console.log('No sessionId in token');
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };