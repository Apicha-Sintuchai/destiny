import { getVipSetting } from "@/actions/admin/admin.service";
import { setVipCreditPriceAction } from "@/actions/admin/admin.actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseDisclosureReturn } from "@/hooks/useDisclosure";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Crown } from "lucide-react";

export default function VipPriceSettingModal({
    disclosure,
}: {
    disclosure: UseDisclosureReturn;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [price, setPrice] = useState<string>("");

    const fetchVipSetting = async () => {
        const setting = await getVipSetting();
        if (setting) {
            setPrice(setting.value || "0");
        }
    };

    useEffect(() => {
        if (disclosure.state.isOpen) {
            fetchVipSetting();
        }
    }, [disclosure.state.isOpen]);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const priceValue = Number(price);

            if (isNaN(priceValue) || priceValue < 0) {
                toast.error("กรุณากรอกราคาที่ถูกต้อง");
                return;
            }

            setIsLoading(true);

            try {
                const result = await setVipCreditPriceAction(priceValue);

                if (result.success) {
                    toast.success("อัพเดทราคา VIP สำเร็จ", {
                        description: `ราคา VIP ถูกตั้งเป็น ${priceValue.toLocaleString()} เครดิต`,
                    });
                    disclosure.state.onClose();
                } else {
                    toast.error("อัพเดทไม่สำเร็จ", {
                        description: result.error || "เกิดข้อผิดพลาดในการอัพเดทราคา",
                    });
                }
            } catch (error) {
                toast.error("เกิดข้อผิดพลาด", {
                    description: "ไม่สามารถอัพเดทราคาได้ กรุณาลองใหม่อีกครั้ง",
                });
            } finally {
                setIsLoading(false);
            }
        },
        [price, disclosure],
    );

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-600" />
                        ตั้งค่าราคา VIP
                    </DialogTitle>
                </DialogHeader>
                <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="vip-price">ราคา VIP (เครดิต/30 วัน)</Label>
                        <Input
                            id="vip-price"
                            type="number"
                            min="0"
                            step="1"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="กรอกราคา VIP"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            ราคาที่ผู้ใช้ต้องจ่ายเพื่อซื้อสมาชิก VIP เป็นเวลา 30 วัน
                        </p>
                    </div>

                    <div className="bg-amber-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-amber-900">ตัวอย่าง:</p>
                        <p className="text-sm text-amber-800">
                            ราคา: {price ? Number(price).toLocaleString() : "0"} เครดิต
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-amber-600 hover:bg-amber-700"
                        disabled={isLoading}
                    >
                        {isLoading ? "กำลังบันทึก..." : "บันทึกราคา VIP"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
