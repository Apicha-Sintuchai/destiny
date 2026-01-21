"use server";

import { register as registerService, login as loginService } from "./auth.service";
import { z } from "zod";
import { loginSchema, registerSchema } from "./auth.validation";
import { deleteSession, encrypt, getSession as getJWTSession } from "@/lib/jwt";
import { ActionResponse } from "@/types/action.types";

type RegisterData = z.infer<typeof registerSchema>;
type LoginData = z.infer<typeof loginSchema>;

export async function register(data: RegisterData): ActionResponse<null> {
    try {
        await registerService(data);

        return { success: true, message: "สมัครสมาชิกสําเร็จ", data: null };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function login(data: LoginData): ActionResponse<null> {
    try {
        const user = await loginService(data);

        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        await encrypt({
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            expires,
        });

        return { success: true, message: "เข้าสู่ระบบสําเร็จ", data: null };
    } catch (error: any) {
        console.log(error)

        return { success: false, message: error.message };
    }
}

export async function logout() {
    await deleteSession();
}

export async function getSession() {
    return await getJWTSession();
}
