import { UseDisclosureReturn } from "@/hooks/useDisclosure";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export type PickUpCard = {
    name: string[];
    nickname: string[];
    image: string[];
    description: string[] | null;
   
};

export type SelectedCard = {
    name: string;
    nickname: string;
    description: string;
    userpickcardcount: number;
};

export interface SelectCardModalProps {
    next: () => void;
    selectCard: (cards: SelectedCard) => void;
    cards: { name: string; nickname: string; image: string; description: string }[];
    fortunetellerId: string;
    title: string;
    userpickcardcount: number;
}

const SelectCard = ({ disclosure }: { disclosure: UseDisclosureReturn<SelectCardModalProps> }) => {
    const [clickcard, setclickcard] = useState<PickUpCard>({
        name: [],
        nickname: [],
        image: [],
        description: [],
    });

    const cards = disclosure.data.cards;
    const MAX_LENGTH = Math.min(cards.length, disclosure.data.userpickcardcount);
    const onSubmit = async () => {
        disclosure.data.selectCard({
            name: clickcard.name.join(", "),
            nickname: clickcard.nickname.join(", "),
            description: clickcard.description?.join(", ") || "",
            userpickcardcount: clickcard.name.length,
        });
        disclosure.data.next();
    };

    useEffect(() => {
        if (MAX_LENGTH === 0) return;

        if (clickcard.name.length === MAX_LENGTH) {
            onSubmit();
        }
    }, [clickcard.name.length]);

    // แบ่งการ์ดออกเป็นชั้นๆ ละ 5 ใบ
    const chunkedCards = [];
    for (let i = 0; i < cards.length; i += 5) {
        chunkedCards.push(cards.slice(i, i + 5));
    }

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent onWheel={(e) => e.stopPropagation()} className={``}>
                <DialogHeader>
                    <DialogTitle className="text-white">{disclosure.data.title}</DialogTitle>
                </DialogHeader>
                <div className="mb-4">
                    <p className="text-white text-center">
                        เลือกแล้ว: {clickcard.name.length} / {MAX_LENGTH} ใบ
                    </p>
                </div>
                <div className="relative h-[60vh] overflow-auto">
                    {MAX_LENGTH == 0 && <div>ไม่มีใบ</div>}

                    {MAX_LENGTH > 0 &&
                        chunkedCards.map((rowCards, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-5 gap-2 relative">
                                {rowCards.map((item) => {
                                    const isSelected = clickcard.name.includes(item.name);
                                    const isFull = clickcard.name.length >= MAX_LENGTH;
                                    const isDisabled = isSelected || isFull;

                                    return (
                                        <div
                                            key={item.name}
                                            className={`p-2 rounded-lg text-center transition-all ${
                                                isDisabled
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer hover:opacity-75 hover:scale-105 hover:z-50"
                                            }`}
                                            onClick={() => {
                                                if (isDisabled) return;
                                                setclickcard({
                                                    name: [...clickcard.name, item.name],
                                                    nickname: [
                                                        ...clickcard.nickname,
                                                        item.nickname,
                                                    ],
                                                    image: [...clickcard.image, item.image],
                                                    description: [
                                                        ...(clickcard.description || []),
                                                        item.description,
                                                    ],

                                                });
                                            }}
                                        >
                                            <Image
                                                src={"/backcard/heath.jpg"}
                                                alt={item.name}
                                                width={100}
                                                height={100}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                </div>
                <DialogFooter>
                    <Button onClick={disclosure.state.onClose}>ปิด</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SelectCard;
