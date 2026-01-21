import {
    AccountTopupOptions,
    getAccountTopup,
    updateAccountTopup,
} from "@/actions/topup/topup.service";
import { updateAccountTopupSchema } from "@/actions/topup/topup.validation";
import { useAppForm } from "@/components/form/hooks";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDisclosureReturn } from "@/hooks/useDisclosure";
import { actionWithToast } from "@/lib/actions";
import { revalidateLogic } from "@tanstack/react-form";
import { useCallback, useEffect, useRef, useState } from "react";

export default function AdminTopupSettingModal({
    disclosure,
}: {
    disclosure: UseDisclosureReturn;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [defaultAccountTopup, setAccountTopup] = useState<AccountTopupOptions>({
        promptpay_account: "",
        promptpay_name: "",
        bank_name: "",
        bank_account: "",
        bank_account_name: "",
    });

    const form = useAppForm({
        defaultValues: defaultAccountTopup,
        validators: {
            onChange: updateAccountTopupSchema,
            onSubmit: updateAccountTopupSchema,
        },
        validationLogic: revalidateLogic({
            mode: "submit",
            modeAfterSubmission: "change",
        }),
        onSubmit: async ({ value }) => {
            setIsLoading(true);

            await actionWithToast(() => updateAccountTopup(value), {
                loading: "กําลังอัพเดท",
                error: "อัพเดทไม่สําเร็จ",
                success: `บัญชีถูกอัพเดทเรียบร้อย`,
            });

            setIsLoading(false);
            disclosure.state.onClose();
        },
    });

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            e.stopPropagation();

            form.handleSubmit();
        },
        [form],
    );

    const fetchAccountTopup = async () => {
        const accountTopup = await getAccountTopup();

        if (!accountTopup) return;

        setAccountTopup(accountTopup);
    };

    useEffect(() => {
        fetchAccountTopup();
    }, []);

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>แก้ไขบัญชี</DialogTitle>
                </DialogHeader>
                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                    <form.AppField name="promptpay_account">
                        {(field) => <field.Input label="PromptPay Account" />}
                    </form.AppField>

                    <form.AppField name="promptpay_name">
                        {(field) => <field.Input label="PromptPay Name" />}
                    </form.AppField>



                    <form.AppField name="bank_name">
                        {(field) => <field.Input label="Bank Name" />}
                    </form.AppField>

                    <form.AppField name="bank_account">
                        {(field) => <field.Input label="Bank Account" />}
                    </form.AppField>

                    <form.AppField name="bank_account_name">
                        {(field) => <field.Input label="Bank Account Name" />}
                    </form.AppField>

                    <Button type="submit" className="w-full bg-purple-500" disabled={isLoading}>
                        {isLoading ? "กําลังบันทึก..." : "บันทึก"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
