"use server";

import { getSession } from "../auth/auth.action";
import { getVipSetting } from "../admin/admin.service";
import { getSubscribedUser, getUserService, purchaseVipService } from "./user.service";
import { ActionResponse } from "@/types/action.types";

export async function getUser() {
    try {
        const session = await getSession();

        const user = getUserService(session?.id);

        return user;
    } catch {
        return null;
    }
}

export async function getUserSubscription() {
    try {
        const session = await getSession();
        if (!session?.id) {
            return { success: false, error: "Not authenticated" };
        }

        const subscription = await getSubscribedUser(session.id);

        return { success: true, data: subscription };
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return { success: false, error: "Failed to fetch subscription" };
    }
}

export async function getVipSettingAction() {
    try {
        const setting = await getVipSetting();
        return { success: true, data: setting };
    } catch (error) {
        console.error("Error fetching VIP setting:", error);
        return { success: false, error: "Failed to fetch VIP setting" };
    }
}

export async function purchaseVip(): ActionResponse<null> {
    try {
        const session = await getSession();

        if (!session?.id) throw new Error("Not authenticated");

        await purchaseVipService(session.id);

        return { success: true, message: "VIP purchased successfully", data: null };
    } catch (error: any) {
        console.error("Error purchasing VIP:", error);

        return { success: false, message: error.message || "Failed to purchase VIP" };
    }
}
