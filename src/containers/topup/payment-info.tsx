import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { AccountTopup } from "@prisma/client";
import jsQR from "jsqr";
import { toast } from "sonner";
import { PaymentMethod } from "@/actions/topup/topup.types";
import { actionWithToast } from "@/lib/actions";
import { topupAction } from "@/actions/topup/topup.action";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
    method: PaymentMethod;
    qrCode: string;
    isProcessing: boolean;
    setIsProcessing: (value: boolean) => void;
    setStep: (step: number) => void;
    amount: number | "";
    accountTopup: AccountTopup;
}

export const PaymentInfo = ({
    setIsProcessing,
    method,
    qrCode,
    amount,
    accountTopup,
    setStep,
    isProcessing,
}: Props) => {
    const [slip, setSlip] = useState<File | null>(null);
    const [qrPayload, setQrPayload] = useState<string>();

    const handleSlipUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files) {
            const file = files[0];

            setSlip(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target?.result as string;

                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    if (!ctx) return;

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);

                    if (code) {
                        setQrPayload(code.data);
                    }
                };
            };

            reader.readAsDataURL(file);
        }
    };

    const handleConfirm = () => {
        setIsProcessing(true);

        if (!qrPayload || !amount) return;

        actionWithToast(() => topupAction(qrPayload, amount), {
            loading: "กําลังตรวจสอบ",
            error: (err) => {
                setIsProcessing(false);

                return err;
            },
            success: (data) => {
                setIsProcessing(false);

                return data;
            },
        });

        toast.promise(topupAction(qrPayload, amount), {});
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card>
                {method === "QR" ? (
                    <div className="text-center space-y-4">
                        <CardHeader>สแกน QR Code เพื่อชำระเงิน</CardHeader>
                        <div className="bg-white p-4 rounded-2xl shadow-lg inline-block">
                            <QRCodeSVG value={qrCode || ""} width={200} height={200} />
                        </div>
                        <div className=" flex items-center justify-center p-3 shadow-sm">
                            <p className="text-lg font-bold text-blue-600 bg-black/80 rounded-md py-2 px-4">จำนวนเงิน: ฿{amount}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <CardHeader>ข้อมูลบัญชีสำหรับโอนเงิน</CardHeader>
                        <div className="backdrop-blur rounded-xl p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">ชื่อบัญชี:</span>
                                <span className="font-semibold">
                                    {accountTopup.bank_account_name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">เลขบัญชี:</span>
                                <span className="font-mono font-semibold">
                                    {accountTopup.bank_account}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">ธนาคาร:</span>
                                <span className="font-semibold text-green-600">
                                    {accountTopup.bank_name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">จำนวนเงิน:</span>
                                <span className="font-bold text-lg text-blue-600">฿{amount}</span>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            <div className="space-y-3">
                <label className="text-lg font-semibold">แนบสลิปการโอนเงิน</label>
                <div className="relative">
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipUpload}
                    />
                    {slip && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex items-center space-x-2">
                                <svg
                                    className="w-5 h-5 text-green-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="text-sm text-green-700 font-medium">
                                    อัปโหลดสำเร็จ: {slip.name}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button
                    size="lg"
                    className="flex-1 border-2 bg-black backdrop-blur hover:bg-black/80 border-gray-400 transition-all duration-300"
                    onClick={() => setStep(1)}
                    disabled={isProcessing}
                >
                    กลับ
                </Button>
                <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleConfirm}
                    disabled={!slip}
                >
                    {isProcessing ? "กำลังยืนยัน..." : "ยืนยันการชำระเงิน"}
                </Button>
            </div>
        </div>
    );
};
