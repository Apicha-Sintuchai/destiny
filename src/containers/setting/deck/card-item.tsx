import { memo, useMemo } from "react";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ICardItemProps {
    card: { name: string; nickName: string; image: File | string; meaning: string };
    index: number;
    onNameChange: (index: number, name: string) => void;
    onMeaningChange: (index: number, meaning: string) => void;
    onImageChange: (index: number, file: File) => void;
}

export const CardItem = memo(
    ({
        card,
        index,
        onNameChange,
        onMeaningChange,
        onImageChange,
    }: ICardItemProps) => {
        const imageUrl = useMemo(() => {
            if (!card.image) return null;
            if (typeof card.image === "string") return card.image;
            return URL.createObjectURL(card.image);
        }, [card.image]);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                onImageChange(index, file);
            }
        };

        return (
            <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">ไผ่ลำที่ {index + 1}</span>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">ชื่อไผ่</Label>
                        <Input
                            placeholder="กรอกชื่อไผ่"
                            value={card.nickName}
                            onChange={(e) => onNameChange(index, e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">รูปภาพไผ่</Label>
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">ความหมาย</Label>
                        <Input
                            placeholder="กรอกความหมาย"
                            value={card.meaning}
                            onChange={(e) => onMeaningChange(index, e.target.value)}
                            disabled
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">ตัวอย่างรูป</Label>
                        {imageUrl ? (
                            <div className="flex justify-center">
                                <Image
                                    src={imageUrl}
                                    alt={card.name}
                                    className="w-auto h-64 max-w-full object-contain rounded border shadow-sm"
                                    width={192}
                                    height={256}
                                    loading="lazy"
                                    unoptimized={typeof card.image === "string"}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-64 bg-gray-100 rounded border flex items-center justify-center text-sm text-gray-400">
                                ไม่มีรูปภาพ
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    },
);

CardItem.displayName = "CardItem";
