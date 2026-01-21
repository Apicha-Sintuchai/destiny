"use server";

import { ActionResponse } from "@/types/action.types";
import { topupActionService } from "./topup.service";

export const topupAction = async (
    payload: string,
    expectedAmount: number,
): ActionResponse<null> => {
    try {
        const result = await topupActionService(payload, expectedAmount);

        return {
            success: true,
            message: result.message,
            data: null,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
};
