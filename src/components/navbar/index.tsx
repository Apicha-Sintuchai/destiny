"use client"

import { useAuth } from "@/contexts/auth.context";
import NoSignInNav from "./NoSignInnav"
import { SignInnav } from "./SignInNav"

type NavProps = {
    issignedin: boolean;
    isVips: boolean;
    isAdmin: boolean
};

const Navbar = ({ issignedin, isAdmin, isVips }: NavProps) => {
    const { logout } = useAuth();

    return (
        <nav className="">
            {issignedin ? (
                <div>
                    <SignInnav logout={logout} isVip={isVips} isAdmin={isAdmin} />
                </div>
            ) : (
                <NoSignInNav/>
            )}
        </nav>
    );
};

export default Navbar;
