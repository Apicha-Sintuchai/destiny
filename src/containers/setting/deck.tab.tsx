import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { deleteDeck, getDeckByIdResponse, getOwnDecks } from "@/actions/deck/deck.action";
import useSWR from "swr";
import { actionWithToast } from "@/lib/actions";
import { useRouter } from "next/navigation";

export const DeckTab = () => {
    const router = useRouter();

    const { data, mutate } = useSWR("decks", () => getOwnDecks(100, 0));

    const handleManageDeck = (action: "CREATE" | "EDIT", deckId?: string) => {
        if (action === "CREATE") {
            localStorage.removeItem("manage-deck-id");

            router.push("/setting/deck");
        } else {
            if (!deckId) return;

            localStorage.setItem("manage-deck-id", deckId);

            router.push("/setting/deck");
        }
    };

    const handleDelete = async (id: string) => {
        await actionWithToast(() => deleteDeck(id), {
            loading: "กําลังลบไผ่",
            success: "ลบไผ่สําเร็จ",
            error: (err) => `ลบไผ่ไม่สําเร็จ ${err}`,
        });

        mutate();
    };

    return (
        <TabsContent value="deck">
            <Card className="w-full space-y-2">
                <CardHeader>
                    <CardTitle>จัดการไผ่หมอดู</CardTitle>

                    <CardAction>
                        <Button onClick={() => handleManageDeck("CREATE")}>สร้างไผ่</Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        {data &&
                            data.map((deck, index) => (
                                <div key={index} className="mb-4">
                                    <h2 className="text-2xl font-semibold mb-2">{deck.name}</h2>
                                    <div className="p-4 border rounded-lg flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <h1>{deck.name}</h1>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleManageDeck("EDIT", deck.id)}
                                            >
                                                แก้ไข
                                            </Button>
                                            <Button onClick={() => handleDelete(deck.id)}>
                                                ลบ
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};
