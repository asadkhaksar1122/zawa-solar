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
          const ipAddress = req.headers?.['x-forwarded-for'] || 
                           req.headers?.['x-real-ip'] || 
                           req.connection?.remoteAddress || 
                           req.socket?.remoteAddress || 
                           'unknown';
          const userAgent = req.headers?.['user-agent'] || 'unknown';

          // Create our own "device session" record (this is different from NextAuth's JWT cookie)
          const session = new SessionModel({
            userId: user._id,
            ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
            userAgent,
          });
          await session.save();

          // Add session to user's sessions array if not already present
          if (!user.sessions.includes(session._id)) {
            user.sessions.push(session._id);
            await user.save();
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            sessionId: session._id.toString(), // we embed this into the JWT
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
      // Clean up the device session when user signs out
      if (token?.sessionId) {
        try {
          await dbConnect();
          console.log('Cleaning up session on signOut:', token.sessionId);
          
          // Remove session from database
          await SessionModel.findByIdAndDelete(token.sessionId);
          
          // Remove session from user's sessions array
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
      // Handle signout - clear the token
      if (trigger === 'signOut') {
        console.log('JWT callback: signOut trigger, clearing token');
        return {};
      }

      // Initial sign in
      if (user) {
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.name = (user as any).name;
        token.role = (user as any).role;

        if ((user as any).sessionId) {
          token.sessionId = (user as any).sessionId;
          console.log('Setting sessionId in JWT:', token.sessionId);
        }
      }

      // Optional: handle session updates
      if (trigger === 'update' && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        if (session.role) token.role = session.role;
      }

      // Skip session validation during signout process
      if (trigger === 'signOut') {
        return token;
      }

      // On every request, verify that the device session still exists.
      // Throttle the DB check a bit to avoid hammering the DB.
      const now = Date.now();
      const shouldCheck =
        !token.lastSessionCheck || now - (token.lastSessionCheck as number) > 15_000; // 15s

      if (shouldCheck && token.sessionId) {
        try {
          await dbConnect();
          const exists = await SessionModel.exists({ _id: token.sessionId });
          if (!exists) {
            console.log('Session not found in database, forcing logout:', token.sessionId);
            // Return null to force logout when session doesn't exist
            return null;
          }
          token.sessionRevoked = false;
        } catch (e) {
          // Fail closed: if we can't check, treat as revoked and force logout
          console.error('Error checking session validity, forcing logout:', e);
          return null;
        }
        token.lastSessionCheck = now;
      }

      return token;
    },
    async session({ session, token }) {
      // If token is null or empty (session was revoked), return null to force logout
      if (!token || Object.keys(token).length === 0) {
        console.log('Token is null or empty, forcing session logout');
        return null;
      }

      // If this device session was revoked (deleted from DB), return null to force logout
      if (token.sessionRevoked) {
        console.log('Session revoked, forcing logout');
        return null;
      }

      // Ensure we have a valid session object
      if (!session || !session.user) {
        console.log('No valid session or user, returning null');
        return null;
      }

      // Add user data to session
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