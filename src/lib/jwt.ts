"use server";

import { Role } from "@prisma/client";
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";
import { env, requireEnv } from "./env";

let encodedKey: Uint8Array | null = null;

function getEncodedKey(): Uint8Array {
    if (!encodedKey) {
        const secretKey = requireEnv("SESSION_SECRET");
        encodedKey = new TextEncoder().encode(secretKey);
    }
    return encodedKey;
}

export interface SessionPayload extends JWTPayload {
    id: string;
    firstname: string;
    lastname: string;
    role: Role;
    expires: string;
}

export async function encrypt(payload: SessionPayload) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(getEncodedKey());

    const nodeEnv = process.env.NODE_ENV;

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: nodeEnv === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return token;
}

export async function decrypt<T extends JWTPayload = SessionPayload>(
    session: string | undefined = "",
): Promise<T | null> {
    if (!session) {
        return null;
    }
    try {
        const { payload } = await jwtVerify(session, getEncodedKey(), {
            algorithms: ["HS256"],
        });
        return payload as T;
    } catch (error) {
        console.log("Failed to verify session");
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();

    const session = cookieStore.get("session")?.value;

    return await decrypt(session);
}

export async function deleteSession() {
    const cookieStore = await cookies();

    cookieStore.delete("session");
}
