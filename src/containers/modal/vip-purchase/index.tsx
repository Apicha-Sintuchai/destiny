import { getVipSettingAction, purchaseVip } from "@/actions/user/user.action";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth.context";
import { UseDisclosureReturn } from "@/hooks/useDisclosure";
import { actionWithToast } from "@/lib/actions";
import { Crown } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";

export default function VipPurchase({ disclosure }: { disclosure: UseDisclosureReturn }) {
    const { user } = useAuth();
    const [isPurchasing, setIsPurchasing] = useState(false);

    const { data: vipSettingData } = useSWR("vip-setting", getVipSettingAction);
    const vipPrice = vipSettingData?.success ? Number(vipSettingData.data?.value || 0) : 0;

    const handlePurchaseVip = async () => {
        setIsPurchasing(true);

        await actionWithToast(() => purchaseVip(), {
            success: "ซื้อ VIP สำเร็จ!",
            error: "ซื้อ VIP ไม่สำเร็จ",
            loading: "กําลังซื้อ VIP",
        });

        setIsPurchasing(false);
    };

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-600" />
                        ยืนยันการซื้อ VIP
                    </DialogTitle>
                    <DialogDescription className="space-y-2">
                        <p>คุณต้องการซื้อสมาชิก VIP เป็นเวลา 30 วัน?</p>
                        <div className="p-3 rounded-md space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>ราคา:</span>
                                <span className="font-semibold">
                                    {vipPrice.toLocaleString()} เครดิต
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>เครดิตคงเหลือหลังซื้อ:</span>
                                <span className="font-semibold">
                                    {((user?.credit || 0) - vipPrice).toLocaleString()} เครดิต
                                </span>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose disabled={isPurchasing}>ยกเลิก</DialogClose>
                    <Button
                        onClick={handlePurchaseVip}
                        disabled={isPurchasing}
                        className="bg-amber-600 hover:bg-amber-700"
                    >
                        {isPurchasing ? "กำลังดำเนินการ..." : "ยืนยันการซื้อ"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
