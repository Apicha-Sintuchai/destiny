import { signUpSchema } from "@/actions/auth/auth.validation";
import { TabsContent } from "@/components/ui/tabs";
import { useAppForm } from "@/components/form/hooks";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { toast } from "sonner";
import { register } from "@/actions/auth/auth.action";
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave';
import { useState } from "react";
import { GlowEffect } from '@/components/ui/glow-effect';

interface Props {
    switchToSignIn: () => void
}

export const AuthModalSignUp = ({ switchToSignIn }: Props) => {
    const [loading, setLoading] = useState(false)
    const form = useAppForm({
        defaultValues: {
            firstname: "",
            lastname: "",
            phoneNumber: "",
            password: "",
            confirm_password: "",
            birthday: new Date(),
        },
        validators: {
            onChange: signUpSchema,
            onSubmit: signUpSchema,
        },
        validationLogic: revalidateLogic({
            mode: "submit",
            modeAfterSubmission: "change",
        }),
        onSubmit: async ({ value }) => {
            setLoading(true)
            const { success, message } = await register(value)
            setLoading(false)

            if (success) {
                toast.success(message)

                switchToSignIn();
            } else {
                toast.error(message)
            }
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

    return (
        <TabsContent value="sign-up">
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 items-start">
                    <form.AppField name="firstname">
                        {(field) => <field.Input label="ชื่อ" />}
                    </form.AppField>

                    <form.AppField name="lastname">
                        {(field) => <field.Input label="นามสกุล" />}
                    </form.AppField>
                </div>

                <form.AppField name="birthday">
                    {(field) => <field.DatePicker label="วันเกิด" />}
                </form.AppField>

                <form.AppField name="phoneNumber">
                    {(field) => <field.Input label="หมายเลขโทร" />}
                </form.AppField>

                <form.AppField name="password">
                    {(field) => <field.PasswordInput label="รหัสผ่าน" />}
                </form.AppField>

                <form.AppField name="confirm_password">
                    {(field) => <field.PasswordInput label="ยืนยันรหัสผ่าน" />}
                </form.AppField>

                <div className={`flex justify-end`}>
                    <div className="relative">
                        <GlowEffect
                            colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
                            mode='colorShift'
                            blur='soft'
                            duration={3}
                            scale={1}
                            className={`-z-1`}
                        />
                        <Button color="green" disabled={loading} type="submit">
                            {loading ?
                            (<TextShimmerWave className='font-mono text-sm' duration={1}>กำลังสมัครสมาชิก...</TextShimmerWave>)
                            :'สมัครสมาชิก'}
                        </Button>
                    </div>
                </div>
            </form>
        </TabsContent>
    );
};
