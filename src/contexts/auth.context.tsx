"use client";

import { getSession, logout } from "@/actions/auth/auth.action";
import { getUser } from "@/actions/user/user.action";
import { SessionPayload } from "@/lib/jwt";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

type AuthContextType = {
    isAuthentication: boolean;
    session: SessionPayload | null;
    user?: User | null;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
    session,
    children,
}: {
    session: SessionPayload | null;
    children: React.ReactNode;
}) => {
    const [isAuthentication, setIsAuthentication] = useState<boolean>(false);
    const [_session, setSession] = useState<SessionPayload | null>(session);

    const router = useRouter();
    const { data: user } = useSWR(["getUser", isAuthentication], getUser);

    const fetchUser = useCallback(async () => {
        try {
            const user = await getSession();

            setSession(user);
            setIsAuthentication(true);
        } catch (error) {
            setSession(null);
            setIsAuthentication(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleLogout = useCallback(async () => {
        setSession(null);
        setIsAuthentication(false);

        toast.promise(logout, {
            loading: "Logging out...",
            success: () => {
                router.push("/");

                return "ออกจากระบบสำเร็จ";
            },
            error: "Failed to log out",
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthentication,
                session: _session,
                refresh: fetchUser,
                logout: handleLogout,
                user: user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);

    if (!ctx) throw new Error("useAuth must be used within a UserProvider");

    return ctx;
};
