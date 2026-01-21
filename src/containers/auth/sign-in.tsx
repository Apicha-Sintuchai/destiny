"use client";
import { useState } from "react";
import { login } from "@/actions/auth/auth.action";
import { loginSchema } from "@/actions/auth/auth.validation";
import { useAppForm } from "@/components/form/hooks";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { TextShimmerWave } from "@/components/ui/text-shimmer-wave";
import { useCallback } from "react";
import { toast } from "sonner";
import { GlowEffect } from "@/components/ui/glow-effect";

interface Props {
    onCloseModal: () => void;
}

export const AuthModalSignIn = ({ onCloseModal }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const form = useAppForm({
        defaultValues: {
            phoneNumber: "",
            password: "",
        },
        validators: {
            onChange: loginSchema,
            onSubmit: loginSchema,
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            const { success, message } = await login(value);
            setLoading(false);

            if (success) {
                toast.success(message);

                onCloseModal();
            } else {
                toast.error(message);
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
        <TabsContent value="sign-in">
            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <form.AppField name="phoneNumber">
                    {(field) => <field.Input label="หมายเลขโทร" />}
                </form.AppField>

                <form.AppField name="password">
                    {(field) => <field.PasswordInput label="รหัสผ่าน" />}
                </form.AppField>

                <div className={`flex justify-end`}>
                    <div className="relative">
                        <GlowEffect
                            colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
                            mode="colorShift"
                            blur="soft"
                            duration={3}
                            scale={1}
                            className={`-z-1`}
                        />
                        <Button type="submit">
                            {loading ? (
                                <TextShimmerWave className="font-mono text-sm" duration={1}>
                                    กำลังเข้าสู่ระบบ...
                                </TextShimmerWave>
                            ) : (
                                "เข้าสู่ระบบ"
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </TabsContent>
    );
};
