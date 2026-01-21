import React from "react";
import Image from "next/image";
import { useModal } from "@/hooks/useModal";
import { FortuneTellerSkill } from "@/types/fortuneteller";
import { Button } from "../ui/button";
import { useGptAnswer } from "@/hooks/useGptAnswer";
import {
    Carousel,
    CarouselContent,
    CarouselNavigation,
    CarouselItem,
} from "@/components/ui/carousel";
import { Progress } from "../ui/progress";

type Props = {
    data: FortuneTellerSkill[];
};

const CarouselComponent = (Prop: Props) => {
    const { handleAnswerGpt } = useGptAnswer();

    return (
        <Carousel>
            <CarouselContent>
                {Prop.data.map((item, index) => (
                    <CarouselItem
                        key={`${item.name}-${index}`}
                        className="px-4 py-3 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-[30%]"
                    >
                        <div className="group relative bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-2xl overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200 hover:shadow-xl">
                            <div className="relative h-56 bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-blue-900/30 flex justify-center items-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                {item.media.url ? (
                                    <Image
                                        src={item.media.url}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        loading="lazy"
                                        quality={75}
                                    />
                                ) : (
                                    <div className="flex justify-center items-center text-gray-500">
                                        <svg
                                            className="w-16 h-16"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                )}

                                {/* Rank badge */}
                                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold px-4 py-1.5 rounded-full text-sm shadow-lg -rotate-3">
                                    <span className="flex items-center gap-1">
                                        <svg
                                            className="w-4 h-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        #{index + 1}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 relative z-10">
                                <h3 className="text-xl font-bold mb-3 text-white line-clamp-1">
                                    {item.name}
                                </h3>

                                <p className="text-sm mb-4 text-gray-400 line-clamp-2">
                                    {item.character}
                                </p>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="w-4 h-4 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">5.0</span>
                                </div>

                                <div className="mt-2 mb-4">
                                    <div>
                                        <span className="text-sm">ความรัก</span>
                                        <Progress value={item.love} />
                                    </div>
                                    <div>
                                        <span className="text-sm">ชีวิต</span>
                                        <Progress value={item.life} />
                                    </div>
                                    <div>
                                        <span className="text-sm">การเงิน</span>
                                        <Progress value={item.finance} />
                                    </div>
                                    <div>
                                        <span className="text-sm">การงาน</span>
                                        <Progress value={item.career} />
                                    </div>
                                </div>

                                <Button
                                onClick={() =>
                                    handleAnswerGpt({
                                        id: item.id,
                                        name: item.name,
                                        character: item.character,
                                    })
                                }
                                className={`w-full items-center flex gap-2 bg-linear-20 from-pink-500 to-purple-500 shadow-inner shadow-pink-400`}
                                >
                                    <i className="fa-notdog fa-solid fa-eye"></i>ดูดวง
                                </Button>
                                {/*<button
                                    className="w-full relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 shadow-lg overflow-hidden"
                                    onClick={() =>
                                        handleAnswerGpt({
                                            id: item.id,
                                            name: item.name,
                                            character: item.character,
                                        })
                                    }
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                            />
                                        </svg>
                                        ดูดวง
                                    </span>
                                </button>*/}
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
    );
};

export default CarouselComponent;
