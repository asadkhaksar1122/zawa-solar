
// Add NextAuth types
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      // Keep `id` so code that reads `session.user.id` compiles correctly.
      id?: string | null;
    } & DefaultSession['user']; // Keep existing user properties like name, email, image
  }
}


export interface Company {
  _id: string;
  name: string;
  logoUrl?: string;
}

export interface SolarSolution {
  _id: string;
  name: string;
  company: string;
  companyId: string;
  description: string;
  imageUrl: string;
  powerOutput?: string;
  efficiency?: string;
  features?: string[];
  warranty?: string;
  createdAt?: string;  // ISO string date
  updatedAt?: string;  // ISO string date
  __v?: number;
}


export interface ContactItem {
  _id: string;
  value: string;
}



// lib/types.ts
export interface DashboardData {
  userCount: number;
  solutionCount: number;
}

export interface ContactSettings {
  _id: any;
  whatsappNumbers: ContactItem[];
  emailAddresses: ContactItem[];
  phoneNumbers: ContactItem[];
  facebookUrl: string;
  officeAddress: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  img: string;
  education: string;
  experience: string;
  achievements: string;
  createdAt?: string;
  updatedAt?: string;
}
