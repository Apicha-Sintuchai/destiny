import { getSession } from "@/actions/auth/auth.action";
import Navbar from "../navbar";

export const UserLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getSession();

    const isSignedIn = !!session;
    const isVips = session?.role == "VIP";
    const isAdmin = session?.role == "ADMIN";

    return (
        <div className="relative">
            <div className={`fixed top-0 z-20 w-full`}>
                <Navbar issignedin={isSignedIn} isVips={isVips} isAdmin={isAdmin} />
            </div>
            <div className={` pt-18`}>{children}</div>
        </div>
    );
};
