"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createDeck, getDeckById, updateDeck } from "@/actions/deck/deck.action";
import { CardType, fetchCards } from "@/actions/utils/utils.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { actionWithToast } from "@/lib/actions";

import { CardItem } from "./card-item";
import { toast } from "sonner";

interface ICardDestiny {
    name: string;
    nickName: string;
    image: File | string;
    meaning: string;
}

interface IardDestinyWithId extends ICardDestiny {
    id: string;
}

interface IUpdateCardDestiny extends Partial<ICardDestiny> {
    id: string;
}

export const ManageDeck = () => {
    const router = useRouter();

    const [actionFlag, setActionFlag] = useState<"CREATE" | "EDIT">("EDIT");
    const [deckId, setDeckId] = useState<string>();
    const [deckName, setDeckName] = useState<string>("");
    const [deckDescription, setDeckDescription] = useState<string>("");
    const [cardDestiny, setCardDestiny] = useState<Array<ICardDestiny | IardDestinyWithId>>([]);
    const [updateCardDestiny, setUpdateCardDestiny] = useState<Array<IUpdateCardDestiny>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const cardsPerPage = 12;

    const [love, setLove] = useState<number>(50);
    const [life, setLife] = useState<number>(50);
    const [finance, setFinance] = useState<number>(50);
    const [career, setCareer] = useState<number>(50);

    const [selectedCard, setSelectedCard] = useState<CardType>("TARO");

    const handleNameChange = async (index: number, name: string) => {
        setCardDestiny((prev) =>
            prev.map((card, i) => (i === index ? { ...card, nickName: name } : card)),
        );

        if (actionFlag === "EDIT") {
            const payload = getUpdatePayload(index, { nickName: name });

            handleUpdateChange(index, {
                id: payload.id,
                nickName: name,
            });
        }
    };

    const handleMeaningChange = async (index: number, meaning: string) => {
        setCardDestiny((prev) =>
            prev.map((card, i) => (i === index ? { ...card, meaning } : card)),
        );

        if (actionFlag === "EDIT") {
            const payload = getUpdatePayload(index, { meaning });

            handleUpdateChange(index, {
                id: payload.id,
                meaning: meaning,
            });
        }
    };

    const handleImageChange = async (index: number, file: File) => {
        setCardDestiny((prev) =>
            prev.map((card, i) => (i === index ? { ...card, image: file } : card)),
        );

        if (actionFlag === "EDIT") {
            const payload = getUpdatePayload(index, { image: file });

            handleUpdateChange(index, {
                id: payload.id,
                image: file,
            });
        }
    };

    const getUpdatePayload = (index: number, override: Partial<IUpdateCardDestiny>) => {
        const card = cardDestiny[index] as IUpdateCardDestiny;

        return {
            id: card.id,
            name: card.name,
            nickName: override.nickName ?? card.nickName,
            meaning: override.meaning ?? card.meaning,
            file: override.image ?? card.image,
        };
    };

    const handleUpdateChange = async (index: number, data: IUpdateCardDestiny) => {
        setUpdateCardDestiny((prev) => {
            const copy = [...prev];

            copy[index] = data;

            return copy;
        });
    };

    const handleSubmit = async () => {
        if (actionFlag === "CREATE") {
            const cardsWithFiles = await Promise.all(
                cardDestiny.map(async (card) => {
                    let imageFile = card.image;

                    if (typeof card.image === "string") {
                        try {
                            const response = await fetch(card.image);
                            const blob = await response.blob();
                            const filename = card.image.split("/").pop() || "card.jpg";
                            imageFile = new File([blob], filename, { type: blob.type });
                        } catch (error) {
                            console.error(`Failed to convert image for ${card.name}:`, error);
                        }
                    }

                    return {
                        name: card.name,
                        nickName: card.nickName,
                        description: card.meaning,
                        media: imageFile as File,
                    };
                }),
            );

            await actionWithToast(
                () =>
                    createDeck({
                        name: deckName,
                        description: deckDescription,
                        love,
                        life,
                        finance,
                        career,
                        cards: cardsWithFiles,
                        type: selectedCard,
                    }),
                {
                    loading: "กําลังสร้างไผ่",
                    success: (data) => data,
                    error: (err) => err,
                },
            );
        } else {
            if (!deckId) {
                return toast.error("เกิดข้อผิดพลาดในการแก้ไขไผ่ กรุณาลองใหม่อีกครั้ง");
            }

            await actionWithToast(
                () =>
                    updateDeck({
                        id: deckId,
                        name: deckName,
                        description: deckDescription,
                        love: love,
                        life: life,
                        finance: finance,
                        career: career,
                        cards: updateCardDestiny,
                    }),
                {
                    loading: "กำลังแก้ไขไผ่",
                    success: (data) => data,
                    error: (err) => err,
                },
            );
        }

        router.push("/setting");
    };

    const paginatedCards = useMemo(() => {
        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        return cardDestiny.slice(startIndex, endIndex);
    }, [cardDestiny, currentPage, cardsPerPage]);

    const totalPages = useMemo(
        () => Math.ceil(cardDestiny.length / cardsPerPage),
        [cardDestiny.length, cardsPerPage],
    );

    useEffect(() => {
        const handlefetchCards = async () => {
            setIsLoading(true);

            try {
                const cards = await fetchCards(selectedCard);

                setCardDestiny(
                    cards.map((card) => ({
                        name: card.name_th,
                        nickName: card.name_th,
                        meaning: card.description_th,
                        image: card.image,
                    })),
                );
            } catch (error) {
                console.error("Failed to fetch cards:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (actionFlag === "EDIT") return;

        handlefetchCards();
    }, [actionFlag, selectedCard]);

    useEffect(() => {
        const fetchDeck = async (deck_id: string) => {
            const deck = await getDeckById(deck_id);

            setDeckId(deck.id);
            setSelectedCard(deck.type);
            setDeckName(deck.name);
            setDeckDescription(deck.description || "");
            setLove(deck.love);
            setLife(deck.life);
            setFinance(deck.finance);
            setCareer(deck.career);

            setCardDestiny(
                deck.cards.map((card) => ({
                    id: card.id,
                    name: card.name,
                    nickName: card.nickName || card.name,
                    meaning: card.description,
                    image: card.media.url,
                })),
            );

            setIsLoading(false);
        };

        const deck_id = localStorage.getItem("manage-deck-id");

        if (!deck_id) {
            setActionFlag("CREATE");
        } else {
            setActionFlag("EDIT");

            fetchDeck(deck_id);
        }
    }, []);

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader className="max-w-4xl">
                    <CardTitle>สร้างไผ่</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex justify-between items-center mb-4">
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex gap-4">
                                <Input
                                    placeholder="ชื่อชุดไผ่"
                                    value={deckName}
                                    onChange={(e) => setDeckName(e.target.value)}
                                    className="max-w-xs"
                                />

                                <Select
                                    onValueChange={(e) => setSelectedCard(e as CardType)}
                                    value={selectedCard}
                                    disabled={isLoading || actionFlag === "EDIT"}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="เลือกชุดไผ่" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>เลือกชุดไผ่</SelectLabel>
                                            <SelectItem value="TARO">ไพ่ทาโร</SelectItem>
                                            <SelectItem value="LENORMAND">เลอนอร์มังด์</SelectItem>
                                            <SelectItem value="POKER">โปเกอร์</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Input
                                placeholder="รายละเอียดชุดไผ่"
                                value={deckDescription}
                                onChange={(e) => setDeckDescription(e.target.value)}
                                className="max-w-xs"
                            />
                        </div>

                        <div className="flex gap-4 w-full">
                            <Field>
                                <FieldLegend>ความรัก</FieldLegend>
                                <Slider
                                    defaultValue={[50]}
                                    max={100}
                                    step={1}
                                    onValueChange={(v) => setLove(v[0])}
                                />
                            </Field>

                            <Field>
                                <FieldLegend>ชีวิต</FieldLegend>
                                <Slider
                                    defaultValue={[50]}
                                    max={100}
                                    step={1}
                                    onValueChange={(v) => setLife(v[0])}
                                />
                            </Field>

                            <Field>
                                <FieldLegend>การเงิน</FieldLegend>
                                <Slider
                                    defaultValue={[50]}
                                    max={100}
                                    step={1}
                                    onValueChange={(v) => setFinance(v[0])}
                                />
                            </Field>

                            <Field>
                                <FieldLegend>การงาน</FieldLegend>
                                <Slider
                                    defaultValue={[50]}
                                    max={100}
                                    step={1}
                                    onValueChange={(v) => setCareer(v[0])}
                                />
                            </Field>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                <p className="text-gray-500">กำลังโหลดไผ่...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    แสดง {(currentPage - 1) * cardsPerPage + 1}-
                                    {Math.min(currentPage * cardsPerPage, cardDestiny.length)} จาก{" "}
                                    {cardDestiny.length} ใบ
                                </p>
                                {totalPages > 1 && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) => Math.max(1, prev - 1))
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            ก่อนหน้า
                                        </Button>
                                        <span className="flex items-center px-3 text-sm">
                                            หน้า {currentPage} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(totalPages, prev + 1),
                                                )
                                            }
                                            disabled={currentPage === totalPages}
                                        >
                                            ถัดไป
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-4 space-x-4 space-y-4">
                                {paginatedCards.map((card, index) => {
                                    const actualIndex = (currentPage - 1) * cardsPerPage + index;
                                    return (
                                        <CardItem
                                            key={actualIndex}
                                            card={card}
                                            index={actualIndex}
                                            onNameChange={handleNameChange}
                                            onMeaningChange={handleMeaningChange}
                                            onImageChange={handleImageChange}
                                        />
                                    );
                                })}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-4 flex justify-center">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) => Math.max(1, prev - 1))
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            ก่อนหน้า
                                        </Button>
                                        <span className="flex items-center px-3 text-sm">
                                            หน้า {currentPage} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(totalPages, prev + 1),
                                                )
                                            }
                                            disabled={currentPage === totalPages}
                                        >
                                            ถัดไป
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>

                <CardFooter className="mt-4">
                    <Button onClick={handleSubmit}>บันทึก</Button>
                </CardFooter>
            </Card>
        </div>
    );
};
