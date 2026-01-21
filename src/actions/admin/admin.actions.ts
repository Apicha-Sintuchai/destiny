"use server";

import { getUsers, getUsersCount, setVipCreditPriceService } from "./admin.service";

export const getUsersAction = async (take: number, skip: number) => {
    try {
        const users = await getUsers(take, skip);
        return { success: true, data: users };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
};

export const getUsersCountAction = async () => {
    try {
        const count = await getUsersCount();
        return { success: true, data: count };
    } catch (error) {
        console.error("Error fetching users count:", error);
        return { success: false, error: "Failed to fetch users count" };
    }
};

export const setVipCreditPriceAction = async (price: number) => {
    try {
        await setVipCreditPriceService(price);
        return { success: true, message: "VIP price updated successfully" };
    } catch (error) {
        console.error("Error setting VIP price:", error);
        return { success: false, error: "Failed to set VIP price" };
    }
};
