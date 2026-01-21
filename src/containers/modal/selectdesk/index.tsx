import { UseDisclosureReturn } from "@/hooks/useDisclosure";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getDecksResponse } from "@/actions/deck/deck.action";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselNavigation,
    CarouselItem,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";

export interface SelectDeskModalProps {
    next: () => void;
    selectDeck: (id: string) => void;
    decks: getDecksResponse;
}

const SelectDesk = ({ disclosure }: { disclosure: UseDisclosureReturn<SelectDeskModalProps> }) => {
    const decks = disclosure.data.decks;

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent onWheel={(e) => e.stopPropagation()} className="md:!max-w-3xl w-full">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        เลือก Deck ของคุณ
                    </DialogTitle>
                </DialogHeader>

                <div className="py-6 mb-10">
                    <Carousel className="w-full">
                        <CarouselContent className="">
                            {decks.map((desk) => (
                                <CarouselItem
                                    key={desk.id}
                                    className="p-4 basis-1/1 w-15  md:basis-1/2 lg:basis-[40%]"
                                >
                                    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-1 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                                        <div className="rounded-lg bg-gray-900 p-4">
                                            <div className="relative h-56 w-full overflow-hidden rounded-lg mb-4">
                                                <Image
                                                    src={
                                                        desk.cards[desk.cards.length - 1].media.url
                                                    }
                                                    alt={desk.name}
                                                    loading="lazy"
                                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                    fill
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            <h3 className="text-lg font-semibold text-white mb-3 text-center truncate">
                                                {desk.name}
                                            </h3>

                                            <div className="my-4">
                                                <div>
                                                    <span className="text-sm">ความรัก</span>
                                                    <Progress value={desk.love} />
                                                </div>
                                                <div>
                                                    <span className="text-sm">ชีวิต</span>
                                                    <Progress value={desk.life} />
                                                </div>
                                                <div>
                                                    <span className="text-sm">การเงิน</span>
                                                    <Progress value={desk.finance} />
                                                </div>
                                                <div>
                                                    <span className="text-sm">การงาน</span>
                                                    <Progress value={desk.career} />
                                                </div>
                                            </div>

                                            <Button
                                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-300 transform hover:scale-105"
                                                onClick={() => {
                                                    disclosure.data.selectDeck(desk.id);
                                                    disclosure.data.next();
                                                }}
                                            >
                                                เลือก Deck นี้
                                            </Button>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselNavigation
                            className="absolute -bottom-20 left-auto top-auto w-full justify-end gap-2"
                            classNameButton="bg-zinc-800 *:stroke-zinc-50 dark:bg-zinc-200 dark:*:stroke-zinc-800"
                            alwaysShow
                        />
                    </Carousel>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={disclosure.state.onClose}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                        ปิด
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default SelectDesk;
