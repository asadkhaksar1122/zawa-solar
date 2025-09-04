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
        if (!credentials?.email || !credentials.password) return null;

        try {
          await dbConnect();
          const user = await UserModel.findOne({ email: credentials.email });
          if (!user || !user.isEmailVerified) return null;

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
          if (!isPasswordValid) return null;

          // Admin 2FA check (if enabled)
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

          // Get IP address and user agent from request
          const forwarded = req.headers?.['x-forwarded-for'];
          const ipAddress = Array.isArray(forwarded)
            ? forwarded[0]
            : typeof forwarded === 'string'
              ? forwarded.split(',')[0]!.trim()
              : req.headers?.['x-real-ip'] ||
              req.connection?.remoteAddress ||
              req.socket?.remoteAddress ||
              'unknown';

          const userAgent = req.headers?.['user-agent'] || 'unknown';

          // Create device session
          const session = new SessionModel({
            userId: user._id,
            ipAddress,
            userAgent,
          });
          await session.save();

          // Add session to user's sessions array if not already present
          if (!user.sessions.map((s: any) => s.toString()).includes(session._id.toString())) {
            user.sessions.push(session._id);
            await user.save();
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            sessionId: session._id.toString(),
          };
        } catch (error) {
          console.error('Auth error:', error);
          if (error instanceof Error && error.message === '2FA_REQUIRED') throw error;
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  events: {
    async signOut({ token }) {
      if (token?.sessionId) {
        try {
          await dbConnect();
          console.log('Cleaning up session on signOut:', token.sessionId);

          await SessionModel.findByIdAndDelete(token.sessionId);

          if (token.email) {
            const user = await UserModel.findOne({ email: token.email });
            if (user) {
              user.sessions = user.sessions.filter(
                (s: any) => s.toString() !== token.sessionId
              );
              await user.save();
            }
          }
        } catch (error) {
          console.error('Error cleaning up session on signOut:', error);
        }
      }
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign-in: populate token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        if ((user as any).sessionId) {
          token.sessionId = (user as any).sessionId;
          token.lastSessionCheck = Date.now(); // avoid immediate check
        }
      }

      // Handle signOut: just return empty token (session will be cleared)
      if (trigger === 'signOut') {
        return {};
      }

      // Optional: handle session updates
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        if (session.role) token.role = session.role;
      }

      // Periodically validate device session (every 15s)
      const now = Date.now();
      const shouldCheck =
        !token.lastSessionCheck || now - (token.lastSessionCheck as number) > 15_000;

      if (shouldCheck && token.sessionId) {
        try {
          await dbConnect();
          const exists = await SessionModel.exists({ _id: token.sessionId });
          if (!exists) {
            console.log('Session not found in DB, invalidating JWT');
            return {}; // will lead to session.user = undefined
          }
          token.sessionRevoked = false;
        } catch (e) {
          console.error('Error checking session validity, invalidating JWT:', e);
          return {}; // fail closed
        }
        token.lastSessionCheck = now;
      }

      return token;
    },

    async session({ session, token }) {
      // Gracefully handle invalid or revoked sessions
      if (!token || Object.keys(token).length === 0 || token.sessionRevoked === true) {
        return {
          ...session,
          user: undefined,
          expires: new Date().toISOString(), // optional: make it expired
        };
      }

      // Ensure session.user exists
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.sessionId = token.sessionId as string;
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-default-secret-here-change-in-production',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };