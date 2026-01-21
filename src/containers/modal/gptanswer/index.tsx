import { AgentPredictionResponse } from "@/actions/agent/agent.action";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { UseDisclosureReturn } from "@/hooks/useDisclosure";
import { IActionResponse } from "@/types/action.types";
import Image from "next/image";
import { TextScramble } from "@/components/ui/text-scramble";

type GptAnswerModalIsLoading = {
    isLoading: true;
};

type GptAnswerModalLoaded = IActionResponse<AgentPredictionResponse> & {
    isLoading: false;
};

export type GptAnswerModalProps = GptAnswerModalIsLoading | GptAnswerModalLoaded;

const GptAnswerModal = ({
    disclosure,
}: {
    disclosure: UseDisclosureReturn<GptAnswerModalProps>;
}) => {
    const response = disclosure.data;

    return (
        <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
            <DialogContent onWheel={(e) => e.stopPropagation()} className="!max-w-3xl w-full">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center">
                        การทำนายของคุณ
                    </DialogTitle>
                </DialogHeader>

                {response.isLoading && (
                    <div className="flex flex-col justify-center items-center py-16 space-y-4">
                        <Spinner className="size-12" />
                        <p className="text-lg">กำลังเปิดเผยคำทำนาย...</p>
                    </div>
                )}

                {!response.isLoading && (
                    <>
                        {!response.success ? (
                            <div className="p-6 rounded-2xl border">
                                <h3 className="font-bold text-xl">เกิดข้อผิดพลาด</h3>
                                <p className="mt-3">{response.message}</p>
                            </div>
                        ) : (
                            <div className="h-[600px] md:p-4 flex flex-col overscroll-y-contain overflow-auto gap-8">
                                <div className="gap-4 flex flex-col order-2 md:order-1">
                                    {response.data.cards.map((card, index) => (
                                        <div
                                            className="grid grid-cols-3 gap-4 md:gap-8"
                                            key={index}
                                        >
                                            <div className="col-span-1 flex justify-center">
                                                <Image
                                                    src={card.mediaURL}
                                                    alt={card.card_nickname}
                                                    width={100}
                                                    height={100}
                                                    className="rounded"
                                                />
                                            </div>
                                            <div className="col-span-2 h-full flex flex-col justify-center">
                                                <h4 className="font-bold text-xl">
                                                    {card.card_nickname}
                                                </h4>
                                                <p className="text-sm">{card.meaning}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-1 md:order-2 flex md:mx-16 p-8 border rounded-md">
                                    <TextScramble className="indent-8">
                                        {response.data.summary}
                                    </TextScramble>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <DialogFooter className="mt-4">
                    <Button
                        onClick={disclosure.state.onClose}
                        disabled={response.isLoading}
                        className="px-8 py-2 rounded-xl"
                    >
                        ปิด
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default GptAnswerModal;
