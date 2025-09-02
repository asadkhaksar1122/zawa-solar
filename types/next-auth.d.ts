import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user?: DefaultSession["user"] & {
            id?: string;
            role?: string;
            // add sessionId so you can read it on the client
            sessionId?: string;
        };
    }

    interface User extends DefaultUser {
        role?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id?: string;
        email?: string;
        name?: string;
        role?: string;
        // used to correlate the "device session" document
        sessionId?: string;

        // optional helpers for revocation checks
        sessionRevoked?: boolean;
        lastSessionCheck?: number;
    }
}