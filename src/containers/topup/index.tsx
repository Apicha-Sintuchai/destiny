"use client";

import { useState } from "react";
import generatePayload from "promptpay-qr";
import { AccountTopup } from "@prisma/client";
import { PaymentMethod } from "@/actions/topup/topup.types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PaymentSelection } from "./payment-selection";
import { PaymentInfo } from "./payment-info";

interface Props {
    accountTopup: AccountTopup;
}

export const TopupContainer = ({ accountTopup }: Props) => {
    const [step, setStep] = useState(1);
    const [amount, setAmount] = useState<number | "">("");
    const [method, setMethod] = useState<PaymentMethod>("QR");
    const [isProcessing, setIsProcessing] = useState(false);
    const [qrCode, setQrCode] = useState<string>("");

    const handleNext = () => {
        if (amount && method) {
            setIsProcessing(true);

            setQrCode(generatePayload(accountTopup.promptpay_account, { amount: amount }));

            setTimeout(() => {
                setStep(2);
                setIsProcessing(false);
            }, 500);
        }
    };

    return (
        <div className="min-h-screen flex items-center max-w-2xl w-full justify-center p-4">
            <div className="absolute inset-0 opacity-40"></div>

            <Card className="relative shadow-2xl w-full border-0 backdrop-blur-xl rounded-3xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                <CardHeader className="pb-4 pt-8">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            เติมเงิน
                        </h2>
                        <Progress
                            value={step * 50}
                            color="primary"
                            className="w-full"
                        />
                        <p className="text-sm text-gray-500">ขั้นตอนที่ {step} จาก 2</p>
                    </div>
                </CardHeader>

                <CardContent className="px-8 py-6">
                    {step === 1 && (
                        <PaymentSelection
                            amount={amount}
                            setAmount={setAmount}
                            method={method}
                            setMethod={setMethod}
                            handleNext={handleNext}
                            isProcessing={isProcessing}
                        />
                    )}

                    {step === 2 && (
                        <PaymentInfo
                            isProcessing={isProcessing}
                            method={method}
                            amount={amount}
                            qrCode={qrCode}
                            setStep={setStep}
                            accountTopup={accountTopup}
                            setIsProcessing={setIsProcessing}
                        />
                    )}
                </CardContent>

                <CardFooter className="px-8 py-4 bg-gray-50/50 backdrop-blur">
                    <div className="w-full text-center">
                        <p className="text-xs text-gray-300 flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>ระบบจะตรวจสอบและเพิ่มเครดิตให้โดยอัตโนมัติภายใน 1-2 นาที</span>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};
