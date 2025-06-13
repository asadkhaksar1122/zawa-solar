
// Add NextAuth types
import type { DefaultSession, User as NextAuthUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string | null; // Or id, depending on what you set in session callback
    } & DefaultSession['user']; // Keep existing user properties like name, email, image
  }

  // If you are using JWT strategy, you might want to extend the JWT token type
  // interface JWT {
  //   _id?: string;
  // }

  // Extend the default User model if needed (e.g., if your DB user model has more fields)
  // interface User extends NextAuthUser {
  //   // your custom fields here
  // }
}


export interface Company {
  _id: string;
  name: string;
}

export interface SolarSolution {
  _id: string;
  name:string;
  company: string;
  companyId: string;
  description: string;
  imageUrl: string;
  powerOutput?: string;
  efficiency?: string;
  features?: string[];
  warranty?: string;
}

export interface ContactItem {
  _id: string;
  value: string;
}

export interface ContactSettings {
  whatsappNumbers: ContactItem[];
  emailAddresses: ContactItem[];
  phoneNumbers: ContactItem[];
  facebookUrl: string;
  officeAddress: string;
}
