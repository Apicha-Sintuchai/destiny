import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useModal } from "@/hooks/useModal";
import {
    deleteFortuneTeller,
    getVipFortuneTeller,
} from "@/actions/fortune-teller/fortuneteller.action";
import useSWR from "swr";

import { FortuneTeller } from "@/types/fortuneteller";
import { actionWithToast } from "@/lib/actions";

export const VipTab = () => {
    const { data: vipFortuneTellers, mutate } = useSWR("fortunetellers", async () => {
        const response = await getVipFortuneTeller();
        if (response.success) {
            return response.data;
        }
        return [];
    });

    const { createfortuneteller, editfortuneteller } = useModal();

    const handleCreateFortuneTeller = () => {
        createfortuneteller.setData({ refreshTable: mutate });
        createfortuneteller.state.onOpen();
    };

    const handleEditFortuneTeller = (data: FortuneTeller) => {
        editfortuneteller.setData({ refreshTable: mutate, editdata: data });
        editfortuneteller.state.onOpen();
    };

    const handleDelete = async (id: string) => {
        await actionWithToast(() => deleteFortuneTeller(id), {
            loading: "กําลังลบหมอดูดวง",
            success: "ลบหมอดูดวงสําเร็จ",
            error: (err) => `ลบหมอดูดวงไม่สําเร็จ ${err}`,
        });

        mutate();
    };

    return (
        <TabsContent value="vips">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>การตั้งค่าวิไอพี</CardTitle>
                        <Button onClick={handleCreateFortuneTeller}>สร้างหมอดูดวง</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {vipFortuneTellers &&
                        vipFortuneTellers.map((item: FortuneTeller, index: number) => (
                            <div key={index} className="mb-4">
                                <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
                                <div className="p-4 border rounded-lg flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={item.media.url} />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        <h1>{item.name}</h1>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={() => handleEditFortuneTeller(item)}>
                                            แก้ไข
                                        </Button>
                                        <Button onClick={() => handleDelete(item.id)}>ลบ</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </CardContent>
            </Card>
        </TabsContent>
    );
};
