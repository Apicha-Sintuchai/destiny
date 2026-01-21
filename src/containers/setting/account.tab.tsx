import useSWR from "swr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { TextField } from "@/components/ui/text-field";
import { formatDate } from "@/lib/day";
import { getUser, getUserSubscription, getVipSettingAction } from "@/actions/user/user.action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Crown, Sparkles } from "lucide-react";
import { useModal } from "@/hooks/useModal";

export const AccountTab = () => {
    const { data, isLoading } = useSWR("user", getUser);
    const { data: subscriptionData } = useSWR("user-subscription", getUserSubscription);
    const { data: vipSettingData } = useSWR("vip-setting", getVipSettingAction);
    const { vipPurchase } = useModal()

    const subscription = subscriptionData?.success ? subscriptionData.data : null;
    const vipPrice = vipSettingData?.success ? Number(vipSettingData.data?.value || 0) : 0;

    const isSubscriptionActive =
        subscription &&
        subscription.status === "ACTIVE" &&
        new Date(subscription.expiryAt) > new Date();

    return (
        <TabsContent value="account" className="space-y-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>บัญชี</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h1>ชื่อ</h1>
                    <div className="flex justify-between items-center border-b-2">
                        <TextField isLoading={isLoading}>
                            {data?.firstname} {data?.lastname}
                        </TextField>
                    </div>
                    <h1>วันเกิด</h1>
                    <div className="flex justify-between items-center border-b-2">
                        <TextField isLoading={isLoading}>{formatDate(data?.birthday)}</TextField>
                    </div>
                    <h1>เบอร์โทรศัพท์</h1>
                    <div className="flex justify-between items-center border-b-2">
                        <TextField isLoading={isLoading}>{data?.phoneNumber}</TextField>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Crown className="h-6 w-6 text-amber-600" />
                        <CardTitle className="text-amber-900">สมาชิก VIP</CardTitle>
                    </div>
                    <CardDescription>
                        อัพเกรดเป็นสมาชิก VIP เพื่อรับสิทธิพิเศษมากมาย
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold mb-2">สถานะปัจจุบัน</h3>
                        <div className="flex items-center gap-2">
                            {isSubscriptionActive ? (
                                <Badge className="bg-amber-600 hover:bg-amber-700">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    VIP ACTIVE
                                </Badge>
                            ) : (
                                <Badge variant="secondary">ไม่มีสมาชิก</Badge>
                            )}
                        </div>
                    </div>

                    {isSubscriptionActive && subscription && (
                        <>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">วันที่เริ่ม</p>
                                    <p className="font-medium">
                                        {new Date(subscription.startAt).toLocaleDateString("th-TH")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">วันหมดอายุ</p>
                                    <p className="font-medium">
                                        {new Date(subscription.expiryAt).toLocaleDateString(
                                            "th-TH",
                                        )}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    <Separator />

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">ราคา VIP (30 วัน)</span>
                            <span className="text-lg font-bold text-amber-700">
                                {vipPrice.toLocaleString()} เครดิต
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">เครดิตของคุณ</span>
                            <span className="text-lg font-semibold">
                                {data?.credit?.toLocaleString() || 0} เครดิต
                            </span>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-sm font-semibold mb-2">สิทธิพิเศษสมาชิก VIP</h3>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-amber-600" />
                                <span>ใช้งานฟีเจอร์พิเศษทั้งหมด</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-amber-600" />
                                <span>ดูดวงไม่จำกัด</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-amber-600" />
                                <span>รับประสบการณ์เพิ่มเติม 2 เท่า</span>
                            </li>
                        </ul>
                    </div>

                    <Button
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={vipPurchase.state.onOpen}
                        disabled={!data || (data?.credit || 0) < vipPrice}
                    >
                        <Crown className="h-4 w-4 mr-2" />
                        {isSubscriptionActive ? "ต่ออายุสมาชิก VIP" : "ซื้อสมาชิก VIP"}
                    </Button>

                    {data && (data?.credit || 0) < vipPrice && (
                        <p className="text-xs text-center text-red-600">
                            เครดิตของคุณไม่เพียงพอ กรุณาเติมเครดิต
                        </p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    );
};
