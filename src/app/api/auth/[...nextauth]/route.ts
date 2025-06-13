
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google'; // Example: if you want to add Google Sign-In
// import GithubProvider from 'next-auth/providers/github'; // Example: if you want to add Github Sign-In

// IMPORTANT: In a real application, you would replace the user data and password checks
// with calls to your database.
const users = [
  {
    _id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123', // In a real app, store HASHED passwords only
  },
];

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

        // IMPORTANT: Replace this with your actual user lookup and password verification logic
        const user = users.find((u) => u.email === credentials.email);

        if (user && user.password === credentials.password) { // In real app: compare HASHED password
          // Return an object that will be encoded in the JWT
          return { id: user._id, name: user.name, email: user.email };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          return null;
        }
      },
    }),
    // Example: Add Google Provider
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID as string,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // }),
    // Example: Add GitHub Provider
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string,
    // })
  ],
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for session management
  },
  callbacks: {
    // The `session` callback is called when a session is checked.
    // We can use it to add custom properties to the session object.
    async session({ session, token }) {
      if (token?.sub && session.user) {
         // id is an example, you can use token.sub directly if it's the user id
        (session.user as any).id = token.sub;
      }
      return session;
    },
    // The `jwt` callback is called when a JWT is created or updated.
    // We can use it to add custom properties to the token.
    // async jwt({ token, user, account, profile, isNewUser }) {
    //   if (user) {
    //     token.id = user.id; // Persist the user ID to the token
    //   }
    //   return token;
    // }
  },
  pages: {
    signIn: '/auth/login', // Redirect users to your custom login page
    // error: '/auth/error', // Error code passed in query string as ?error=
    // signOut: '/auth/signout',
    // verifyRequest: '/auth/verify-request', // (used for email/passwordless sign in)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  // secret: process.env.NEXTAUTH_SECRET, // Already set by default if NEXTAUTH_SECRET env var is present
  // debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
