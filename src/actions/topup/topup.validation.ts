import z from "zod";

export const updateAccountTopupSchema = z.object({
    promptpay_account: z.string(),
    promptpay_name: z.string(),
    bank_name: z.string(),
    bank_account: z.string(),
    bank_account_name: z.string(),
});

export type UpdateAccountTopupSchema = z.infer<typeof updateAccountTopupSchema>;
