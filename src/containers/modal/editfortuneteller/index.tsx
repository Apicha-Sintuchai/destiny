import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDisclosureReturn } from "@/hooks/useDisclosure";
import { FieldGroup, FieldLegend, Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRef, useState, useEffect } from "react";
import {
    updateFortuneTeller,
    updateFortuneTellerAvatar,
} from "@/actions/fortune-teller/fortuneteller.action";
import { toast } from "sonner";
import { ForTuneTellerCategory } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FortuneTeller } from "@/types/fortuneteller";
import { Slider } from "@/components/ui/slider";

export interface EditFortuneTellerModalProps {
    refreshTable: () => void;
    editdata: FortuneTeller;
}

const EditFortuneTellerModal = ({
    disclosure,
}: {
    disclosure: UseDisclosureReturn<EditFortuneTellerModalProps>;
}) => {
    const editData = disclosure.data.editdata;

    const [love, setLove] = useState<number>(editData.love);
    const [life, setLife] = useState<number>(editData.life);
    const [finance, setFinance] = useState<number>(editData.finance);
    const [career, setCareer] = useState<number>(editData.career);

    const dataRef = useRef<{ name: string; character: string }>({
        name: "",
        character: "",
    });

    useEffect(() => {
        const handlePlaceState = async () => {
            dataRef.current.name = editData.name || "";
            dataRef.current.character = editData.character || "";
        };

        if (editData) {
            handlePlaceState();
        }
    }, [editData]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dataRef.current.name = e.target.value;
    };

    const handleCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dataRef.current.character = e.target.value;
    };

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file && file.type.startsWith("image/")) {
            setAvatarUrl(URL.createObjectURL(file));

            const response = await updateFortuneTellerAvatar({ media: file }, editData.id);

            if (response.success) {
                toast.success(response.message);

                disclosure.data.refreshTable();
            } else {
                toast.error(response.message);
            }
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    // Call Api

    const handleSubmit = async () => {
        const response = await updateFortuneTeller(
            {
                name: dataRef.current.name,
                character: dataRef.current.character,
                love,
                life,
                finance,
                career,
            },
            editData.id,
        );

        if (response.success) {
            toast.success(response.message);

            disclosure.data.refreshTable();
        } else {
            toast.error(response.message);
        }

        disclosure.state.onClose?.();
    };

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>แก้ไขหมอดู</DialogTitle>
                </DialogHeader>

                <div>
                    <FieldGroup>
                        <Field>
                            {editData?.media?.url && (
                                <div className="text-center">
                                    <div
                                        className="relative inline-block cursor-pointer mb-6"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        onClick={handleAvatarClick}
                                    >
                                        <Avatar className="w-40 h-40 ring-4 ring-white shadow-2xl transition-transform duration-300 hover:scale-105">
                                            <AvatarImage
                                                src={avatarUrl || editData.media.url}
                                                alt="profile"
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500">
                                                <User className="w-20 h-20 text-white" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={`absolute inset-0 w-40 h-40 rounded-full bg-black/50 bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${
                                                isHovered ? "opacity-100" : "opacity-0"
                                            }`}
                                        >
                                            <div className="text-center">
                                                <Camera className="w-8 h-8 text-white mx-auto mb-1" />
                                                <span className="text-white text-sm font-medium">
                                                    แก้ไข
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            size="icon"
                                            className="absolute bottom-2 right-2 w-10 h-10 rounded-full shadow-lg ring-4 ring-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAvatarClick();
                                            }}
                                        >
                                            <Camera className="w-5 h-5" />
                                        </Button>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>
                            )}
                        </Field>

                        <Field>
                            <FieldLegend>ชื่อหมอดู</FieldLegend>
                            <Input onChange={handleNameChange} defaultValue={editData?.name} />
                        </Field>

                        <Field>
                            <FieldLegend>ลักษณะนิสัยหมอดู</FieldLegend>
                            <Input
                                onChange={handleCharacterChange}
                                defaultValue={editData?.character}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLegend>ความรัก</FieldLegend>
                                <Slider
                                    defaultValue={[love]}
                                    max={100}
                                    step={1}
                                    onValueChange={(v) => setLove(v[0])}
                                />
                            </Field>

                            <Field>
                                <FieldLegend>ชีวิต</FieldLegend>
                                <Slider
                                    defaultValue={[life]}
                                    max={100}
                                    step={1}
                                    onValueChange={(v) => setLife(v[0])}
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLegend>การเงิน</FieldLegend>
                                <Slider
                                    defaultValue={[finance]}
                                    max={100}
                                    step={1}
                                    onValueChange={(v) => setFinance(v[0])}
                                />
                            </Field>

                            <Field>
                                <FieldLegend>การงาน</FieldLegend>
                                <Slider
                                    defaultValue={[career]}
                                    max={100}
                                    step={1}
                                    onValueChange={(v) => setCareer(v[0])}
                                />
                            </Field>
                        </div>

                        <Button
                            type="button"
                            onClick={handleSubmit}
                            className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            บันทึกการแก้ไข
                        </Button>
                    </FieldGroup>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditFortuneTellerModal;
