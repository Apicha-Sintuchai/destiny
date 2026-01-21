"use server";

import ModalProvider from "@/providers/ModalProvider";
import { Fragment } from "react";
import { Toaster } from "../ui/sonner";
import { getSession } from "@/actions/auth/auth.action";
import { AuthLayout } from "./AuthLayout";
import { LenisLayout } from "./LenisLayout";

export const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getSession();

    return (
        <Fragment>
            <Toaster richColors position="top-left" closeButton />
            <AuthLayout session={session}>
                <LenisLayout>
                    <ModalProvider>{children}</ModalProvider>
                </LenisLayout>
            </AuthLayout>
        </Fragment>
    );
};
