import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useModal } from "@/hooks/useModal";
import { Crown, Landmark } from "lucide-react";

export const AdminSettingTab = () => {
    const { adminTopupSettring, vipPriceSetting } = useModal();

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure your application settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-sm font-semibold mb-2">Payment Settings</h3>
                            <Button
                                onClick={adminTopupSettring.state.onOpen}
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <Landmark className="h-4 w-4 mr-2" />
                                ตั้งค่าธนาคาร
                            </Button>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold mb-2">VIP Settings</h3>
                            <Button
                                onClick={vipPriceSetting.state.onOpen}
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <Crown className="h-4 w-4 mr-2 text-amber-600" />
                                ตั้งค่าราคา VIP
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
