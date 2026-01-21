"use client";

import { AuthProvider } from "@/contexts/auth.context";
import { SessionPayload } from "@/lib/jwt";

export const AuthLayout = ({
    session,
    children,
}: {
    session: SessionPayload | null;
    children: React.ReactNode;
}) => {
    return <AuthProvider session={session}>{children}</AuthProvider>;
};
