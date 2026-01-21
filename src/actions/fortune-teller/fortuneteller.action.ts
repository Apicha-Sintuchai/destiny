"use server";

import { ActionResponse } from "@/types/action.types";
import {
    createFortuneTeller as createFortuneTellerService,
    getAllFortuneTeller as getAllFortuneTellerService,
    updateFortuneTeller as updateFortuneTellerService,
    updateFortuneTellerAvatar as updateFortuneTellerAvatarService,
    clientGetFortuneTeller,
    deleteFortuneTellerService,
} from "./fortuneteller.service";
import {
    createFortuneTellerSchema,
    updateFortuneTellerSchma,
    mediaSchema,
} from "./fortuneteller.validation";
import { z } from "zod";
import { getSession } from "../auth/auth.action";

type CreateFortuneTellerData = z.infer<typeof createFortuneTellerSchema>;
type UpdateFortuneTellerData = z.infer<typeof updateFortuneTellerSchma>;
type UpdateFortuneTellerAvatarData = z.infer<typeof mediaSchema>;

export async function createFortuneTeller(data: CreateFortuneTellerData): ActionResponse<null> {
    try {
        const session = await getSession();
        if (!session) throw new Error("Unauthorized");

        await createFortuneTellerService(session.id, data);

        return {
            success: true,
            message: "สร้างหมอดูสําเร็จ",
            data: null,
        };
    } catch (error: any) {
        console.log("Create Fortune Teller", error);

        return { success: false, message: error.message };
    }
}

export async function getVipFortuneTeller(): ActionResponse<any> {
    try {
        const fortuneTellers = await getAllFortuneTellerService();
        return {
            success: true,
            message: "Fortune tellers fetched successfully",
            data: fortuneTellers,
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateFortuneTeller(
    data: UpdateFortuneTellerData,
    id: string,
): ActionResponse<null> {
    try {
        await updateFortuneTellerService(data, id);

        return {
            success: true,
            message: "แก้ไขหมอดูสําเร็จ",
            data: null,
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateFortuneTellerAvatar(
    data: UpdateFortuneTellerAvatarData,
    id: string,
): ActionResponse<null> {
    try {
        await updateFortuneTellerAvatarService(data, id);

        return {
            success: true,
            message: "เปลี่ยนรูปหมอดูสําเร็จ",
            data: null,
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function userFortuneTeller(): ActionResponse<any> {
    const client = await clientGetFortuneTeller();

    return {
        success: true,
        message: "ดึงข้อมูลหมอดูสำเร็จ",
        data: client,
    };
}

export async function deleteFortuneTeller(id: string): ActionResponse<null> {
    try {
        await deleteFortuneTellerService(id);

        return {
            success: true,
            message: "ลบหมอดูสําเร็จ",
            data: null,
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
