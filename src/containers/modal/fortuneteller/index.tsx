import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UseDisclosureReturn } from "@/hooks/useDisclosure";
import { FieldGroup, FieldLegend, Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { createFortuneTeller } from "@/actions/fortune-teller/fortuneteller.action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { actionWithToast } from "@/lib/actions";

export interface CreateFortuneTellerModalProps {
    refreshTable: () => void;
}

const CreateFortuneTellerModal = ({
    disclosure,
}: {
    disclosure: UseDisclosureReturn<CreateFortuneTellerModalProps>;
}) => {
    const [love, setLove] = useState<number>(0);
    const [life, setLife] = useState<number>(0);
    const [finance, setFinance] = useState<number>(0);
    const [career, setCareer] = useState<number>(0);

    const dataRef = useRef<{ name: string; character: string; media?: File }>({
        name: "",
        character: "",
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dataRef.current.name = e.target.value;
    };

    const handleCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dataRef.current.character = e.target.value;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dataRef.current.media = e.target.files?.[0];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const media = dataRef.current.media;

        if (!media) {
            toast.error("โปรดเลือกรูปหมอดู");
            return;
        }

        await actionWithToast(
            () =>
                createFortuneTeller({
                    name: dataRef.current.name,
                    character: dataRef.current.character,
                    media: media,
                    love,
                    life,
                    finance,
                    career,
                }),
            {
                loading: "กําลังสร้างหมอดู",
                success: (data) => data,
                error: (err) => `สร้างหมอดูไม่สําเร็จ ${err}`,
            },
        );

        disclosure.data.refreshTable();
        disclosure.state.onClose();
    };

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>สร้างหมอดู</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <FieldGroup>
                        <Field>
                            <FieldLegend>รูปหมอดู</FieldLegend>
                            <Input type="file" onChange={handleFileChange} />
                        </Field>

                        <Field>
                            <FieldLegend>ชื่อหมอดู</FieldLegend>
                            <Input onChange={handleNameChange} />
                        </Field>

                        <Field>
                            <FieldLegend>ลักษณะนิสัยหมอดู</FieldLegend>
                            <Input onChange={handleCharacterChange} />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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

                        {/* <Field>
                            <FieldLegend>เลือกหมวดหมู่เก็บเงิน</FieldLegend>
                            <MultiSelect onValuesChange={handleCategoryChange}>
                                <MultiSelectTrigger className="w-full ">
                                    <MultiSelectValue placeholder="กรุณาเลือกหมวดหมู่" />
                                </MultiSelectTrigger>
                                <MultiSelectContent>
                                    <MultiSelectGroup>
                                        {categoryValue.map((category) => (
                                            <MultiSelectItem key={category} value={category}>
                                                {category}
                                            </MultiSelectItem>
                                        ))}
                                    </MultiSelectGroup>
                                </MultiSelectContent>
                            </MultiSelect>
                        </Field>

                        {selectedCategories.length > 0 && (
                            <div className="space-y-4 mt-4 p-4 ">
                                <h3 className="font-semibold text-sm">ตั้งราคาแต่ละหมวดหมู่</h3>
                                {selectedCategories.map((category) => (
                                    <div
                                        key={category}
                                        className="space-y-3 p-3 border rounded bg-white"
                                    >
                                        <h4 className="font-medium text-sm text-gray-700">
                                            {category}
                                        </h4>

                                        <Field>
                                            <FieldLegend>ราคา (บาท)</FieldLegend>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                value={categoryPricing[category]?.price || 0}
                                                onChange={(e) =>
                                                    handlePriceChange(category, e.target.value)
                                                }
                                            />
                                        </Field>
                                    </div>
                                ))}
                            </div>
                        )} */}

                        <Button
                            type="submit"
                            className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        >
                            สร้างหมอดู
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateFortuneTellerModal;
