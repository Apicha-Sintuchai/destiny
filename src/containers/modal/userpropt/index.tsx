import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { UseDisclosureReturn } from "@/hooks/useDisclosure";
import { useState } from "react";

export interface UserPromptModalProps {
    next: () => void;
    setUserPrompt: (userPrompt: string) => void;
}

const UserPromptModal = ({
    disclosure,
}: {
    disclosure: UseDisclosureReturn<UserPromptModalProps>;
}) => {
    const [userpropt, setuserpropt] = useState<string>("");
    const [charCount, setCharCount] = useState<number>(0);
    const maxChars = 500;

    const onSubmit = async () => {
        if (userpropt.trim()) {
            disclosure.data.setUserPrompt(userpropt);
            disclosure.data.next();
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (text.length <= maxChars) {
            setuserpropt(text);
            setCharCount(text.length);
        }
    };

    const examplePrompts = [
        "💼 งานที่ทำอยู่จะเจริญก้าวหน้าไหม",
        "💰 การเงินในปีนี้เป็นอย่างไร",
        "💕 ความรักจะพบเจอคนที่ใช่เมื่อไหร่",
        "🏥 สุขภาพในอนาคตจะเป็นอย่างไร"
    ];

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent className="max-w-2xl border-primary z-100">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center mb-2">
                        🔮 <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-2">บอกเล่าสิ่งที่อยากรู้</span> 🔮
                    </DialogTitle>
                    <p className="text-sm text-purple-200 text-center">
                        พิมพ์คำถามหรือสิ่งที่คุณอยากทราบคำทำนาย
                    </p>
                </DialogHeader>

                <div className="space-y-4 p-4">
                    {/* Textarea with enhanced styling */}
                    <div className="relative">
                        <Textarea
                            value={userpropt}
                            onChange={handleTextChange}
                            placeholder="เช่น: ฉันกำลังสงสัยว่างานที่กำลังทำอยู่จะประสบความสำเร็จหรือไม่..."
                            className="
                                min-h-[150px]
                                bg-slate-800/80
                                border-purple-500/50
                                text-white
                                placeholder:text-purple-300/50
                                focus:border-purple-400
                                focus:ring-2
                                focus:ring-purple-400/50
                                resize-none
                                rounded-lg
                                transition-all
                                duration-300
                            "
                        />
                        {/* Character counter */}
                        <div className="absolute bottom-3 right-3 text-xs text-purple-300">
                            {charCount}/{maxChars}
                        </div>
                    </div>

                    {/* Example prompts */}
                    <div className="space-y-2">
                        <p className="text-xs text-purple-200 font-medium">💡 ตัวอย่างคำถาม:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {examplePrompts.map((prompt, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setuserpropt(prompt);
                                        setCharCount(prompt.length);
                                    }}
                                    className="
                                        text-left text-xs
                                        p-3
                                        rounded-lg
                                        bg-purple-500/20
                                        hover:bg-purple-500/30
                                        border border-purple-400/30
                                        hover:border-purple-400/60
                                        text-purple-100
                                        transition-all
                                        duration-200
                                        hover:scale-[1.02]
                                        hover:shadow-lg
                                        hover:shadow-purple-500/30
                                    "
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info box */}
                    <div className="flex items-start space-x-2 p-3 rounded-lg bg-purple-500/20 border border-purple-400/30">
                        <span className="text-purple-300 text-sm">✨</span>
                        <p className="text-xs text-purple-100 leading-relaxed">
                            ยิ่งคำถามของคุณชัดเจนและละเอียด ดวงดาวจะสามารถให้คำทำนายที่แม่นยำมากขึ้น
                        </p>
                    </div>
                </div>

                <DialogFooter className="border-t border-purple-500/40 pt-4 gap-2">
                    <Button
                        onClick={disclosure.state.onClose}
                        variant="outline"
                        className="
                            border-purple-400/50
                            text-purple-100
                            hover:bg-purple-500/20
                            hover:text-white
                            transition-all
                        "
                    >
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!userpropt.trim()}
                        className="
                            bg-gradient-to-r
                            from-purple-600
                            to-pink-600
                            hover:from-purple-700
                            hover:to-pink-700
                            text-white
                            shadow-lg
                            hover:shadow-purple-500/50
                            transition-all
                            duration-300
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            disabled:hover:shadow-none
                        "
                    >
                        <span className="flex items-center gap-2">
                            ยืนยัน
                            <span className="text-lg">✨</span>
                        </span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UserPromptModal;
