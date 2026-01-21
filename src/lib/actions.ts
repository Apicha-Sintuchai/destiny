import { ActionResponse } from "@/types/action.types";
import { toast } from "sonner";

export const actionWithToast = async <T>(
    promiseFunction: () => ActionResponse<T>,
    options: {
        loading: string;
        success: string | ((data: string) => string);
        error: string | ((err: string) => string);
    },
): ActionResponse<T> => {
    const toastId = toast.loading(options.loading);

    const result = await promiseFunction();

    if (result.success) {
        const successMessage =
            typeof options.success === "function"
                ? options.success(result.message)
                : options.success;

        toast.success(successMessage, { id: toastId });
    } else {
        const errorMessage =
            typeof options.error === "function" ? options.error(result.message) : options.error;

        toast.error(errorMessage, { id: toastId });
    }

    return result;
};
