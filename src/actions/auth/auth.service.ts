"use server";

import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "./auth.validation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type RegisterData = z.infer<typeof registerSchema>;
type LoginData = z.infer<typeof loginSchema>;

export async function register(data: RegisterData) {
    const validatedData = registerSchema.parse(data);
    const { firstname, lastname, phoneNumber, password, birthday } = validatedData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            firstname,
            lastname,
            phoneNumber,
            password: hashedPassword,
            birthday,
            credit: 0,
            experience: 0,
        },
    });
    return user;
}

export async function login(data: LoginData) {
    const validatedData = loginSchema.parse(data);
    const { phoneNumber, password } = validatedData;
    const user = await prisma.user.findUnique({
        where: {
            phoneNumber,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error("Invalid password");
    }

    return user;
}
