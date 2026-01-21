import { PaymentMethod } from "@/actions/topup/topup.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
    amount: number | "";
    setAmount: (value: number | "") => void;
    method: PaymentMethod;
    setMethod: (method: PaymentMethod) => void;
    handleNext: () => void;
    isProcessing: boolean;
}

const MIN_AMOUNT = 10;
const MAX_AMOUNT = 100000;
const PRESET_AMOUNTS = [50, 100, 300, 500, 1000] as const;

export const PaymentSelection = ({
    amount,
    setAmount,
    method,
    setMethod,
    handleNext,
    isProcessing,
}: Props) => {
    const isValidAmount = amount !== "" && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
    const showError = amount !== "" && !isValidAmount;
    const canProceed = isValidAmount && method && !isProcessing;

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === "") {
            setAmount("");
            return;
        }
        const num = parseInt(val, 10);
        if (!isNaN(num) && num >= 0) {
            setAmount(num);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && canProceed) {
            handleNext();
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500" onKeyDown={handleKeyDown}>
            {/* Amount Section */}
            <fieldset className="space-y-3">
                <legend className="text-lg font-semibold">จำนวนเงิน</legend>

                <div className="relative">
                    <Input
                        type="number"
                        inputMode="numeric"
                        placeholder="ระบุจำนวนเงิน"
                        value={amount}
                        onChange={handleAmountChange}
                        min={MIN_AMOUNT}
                        max={MAX_AMOUNT}
                        aria-invalid={showError}
                        aria-describedby={showError ? "amount-error" : undefined}
                        className={showError ? "border-red-400 focus:ring-red-400" : ""}
                    />
                    {amount !== "" && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                            บาท
                        </span>
                    )}
                </div>

                {showError && (
                    <p id="amount-error" className="text-sm text-red-500" role="alert">
                        กรุณาระบุจำนวนเงินระหว่าง {MIN_AMOUNT.toLocaleString()} - {MAX_AMOUNT.toLocaleString()} บาท
                    </p>
                )}

                <div className="grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-label="จำนวนเงินที่แนะนำ">
                    {PRESET_AMOUNTS.map((amt) => {
                        const isSelected = amount === amt;
                        return (
                            <Button
                                key={amt}
                                type="button"
                                onClick={() => setAmount(amt)}
                                aria-pressed={isSelected}
                                className={`transition-all duration-200 ${
                                    isSelected
                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md scale-[1.02]"
                                        : "bg-black/50 backdrop-blur border-2 border-gray-200/50 hover:border-blue-300"
                                }`}
                            >
                                {amt.toLocaleString()}
                            </Button>
                        );
                    })}
                </div>
            </fieldset>

            {/* Payment Method Section */}
            <fieldset className="space-y-3">
                <legend className="text-lg font-semibold">วิธีการชำระเงิน</legend>

                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="เลือกวิธีการชำระเงิน">
                    <button
                        type="button"
                        role="radio"
                        aria-checked={method === "QR"}
                        onClick={() => setMethod("QR")}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            method === "QR"
                                ? "border-green-500 bg-green-500/10 shadow-md"
                                : "border-gray-700 bg-black/80 hover:border-green-300"
                        }`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <i className="fa-light fa-qrcode text-green-400 text-2xl"></i>
                            <span className="font-medium">QR PromptPay</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        role="radio"
                        aria-checked={method === "BANK"}
                        onClick={() => setMethod("BANK")}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            method === "BANK"
                                ? "border-blue-500 bg-blue-500/10 shadow-md"
                                : "border-gray-700 bg-black/80 hover:border-blue-300"
                        }`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <i className="fa-light fa-credit-card text-xl text-blue-400"></i>
                            <span className="font-medium">โอนธนาคาร</span>
                        </div>
                    </button>
                </div>
            </fieldset>

            {/* Submit Button */}
            <Button
                type="button"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                onClick={handleNext}
                disabled={!canProceed}
                aria-busy={isProcessing}
            >
                {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        กำลังดำเนินการ...
                    </span>
                ) : (
                    <>
                        ดำเนินการต่อ
                        {isValidAmount && <span className="ml-2 opacity-80">({amount.toLocaleString()} บาท)</span>}
                    </>
                )}
            </Button>
        </div>
    );
};
