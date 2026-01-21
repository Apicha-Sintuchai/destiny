import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { UseDisclosureReturn } from "@/hooks/useDisclosure";
import Image from "next/image";
import { Tilt } from "@/components/ui/tilt";
import { CardCategory } from "@/actions/deck/deck.action";

export interface CategoryModalProps {
    next: () => void;
    selectCategory: (category: string, type: CardCategory) => void;
}

const CatagoryModal = ({ disclosure }: { disclosure: UseDisclosureReturn<CategoryModalProps> }) => {
    const catagory: {
        image: string;
        name: string;
        gradient: string;
        icon: string;
        type: CardCategory;
    }[] = [
        {
            image: "/backcard/career.jpg",
            name: "การงาน",
            gradient: "from-blue-500/20 to-purple-500/20",
            icon: "💼",
            type: "CAREER",
        },
        {
            image: "/backcard/money.jpg",
            name: "การเงิน",
            gradient: "from-green-500/20 to-emerald-500/20",
            icon: "💰",
            type: "FINANCE",
        },
        {
            image: "/backcard/love.jpg",
            name: "ความรัก",
            gradient: "from-pink-500/20 to-rose-500/20",
            icon: "💕",
            type: "LOVE",
        },
        {
            image: "/backcard/heath.jpg",
            name: "สุขภาพ",
            gradient: "from-orange-500/20 to-red-500/20",
            icon: "🏥",
            type: "LIFE",
        },
    ];

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent className="max-w-5xl w-full z-100 border-primary">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-center mb-2">
                        ✨ เลือกหมวดหมู่การดูดวง ✨
                    </DialogTitle>
                    <p className="text-sm text-purple-200/70 text-center">
                        เลือกด้านที่คุณต้องการทราบคำทำนาย
                    </p>
                </DialogHeader>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                    {catagory.map((item, index) => (
                        <div
                            key={item.name}
                            className="group relative"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div
                                className={`
                                    relative overflow-hidden rounded-xl
                                    bg-gradient-to-br ${item.gradient}
                                    backdrop-blur-sm border border-white/10
                                    transition-all duration-300 ease-out
                                    hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50
                                    hover:border-purple-400/50
                                    cursor-pointer
                                    transform-gpu
                                `}
                                onClick={() => {
                                    disclosure.data.selectCategory(item.name, item.type);
                                    disclosure.data.next();
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                <div className="p-4 flex flex-col items-center space-y-3">
                                    <Tilt rotationFactor={8} isRevese>
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-purple-500/30 blur-xl rounded-lg group-hover:bg-purple-400/50 transition-colors" />
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                className="relative rounded-lg w-20 shadow-lg ring-2 ring-white/20 group-hover:ring-purple-400/50 transition-all"
                                                width={120}
                                                height={120}
                                            />
                                        </div>
                                    </Tilt>

                                    <div className="text-center">
                                        {/*<div className="text-2xl mb-1">{item.icon}</div>*/}
                                        <p className="text-white font-semibold text-sm group-hover:text-purple-200 transition-colors">
                                            {item.name}
                                        </p>
                                    </div>
                                </div>

                                {/* Hover glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter className="border-t border-purple-500/20 pt-4">
                    <Button
                        onClick={disclosure.state.onClose}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                    >
                        ปิด
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CatagoryModal;
