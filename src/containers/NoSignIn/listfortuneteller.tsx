import { clientGetFortuneTeller } from "@/actions/fortune-teller/fortuneteller.service";
import { getMediaService } from "@/actions/media/media.service";
import { Card, CardContent } from "@/components/ui/card";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";
import { useState } from "react";
import { Tilt } from "@/components/ui/tilt";
import useSWR from "swr";
import { useGptAnswer } from "@/hooks/useGptAnswer";
export default function ListFortuneTeller() {
    const onemock = [
        {
            name: "หมอดู A",
            character: "เรื่องการงานไว้ใจเรา",
            img: "/teller/teller1.jpg",
        },
        {
            name: "หมอดู B",
            character: "เรื่องการงานไว้ใจเรา",
            img: "/teller/teller2.jpg",
        },
        {
            name: "หมอดู C",
            character: "เรื่องการงานไว้ใจเรา",
            img: "/teller/teller3.jpg",
        },
    ];
    const card = [
        {
            image: `/backcard/career.jpg`,
            name: `การงาน`,
        },
        {
            image: `/backcard/heath.jpg`,
            name: `สุขภาพ`,
        },
        {
            image: `/backcard/love.jpg`,
            name: `ความรัก`,
        },
    ];

    const { data, isLoading } = useSWR("clientGetFortuneTeller", clientGetFortuneTeller);

    const { handleAnswerGpt } = useGptAnswer();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            {/*<div className="grid grid-cols-4 gap-4 rounded-2xl">
                {
                    ใช้อันนี้ไปแทน ถ้า เปิด docker ไม่ได้
                    onemock.map((item) => (
                        <Card key={item.name} className="relative w-full h-full overflow-hidden" onClick={() => somethingclick({ name: item.name, character: item.character })} >
                            <Image
                                src={item.img}
                                alt="Fortune Teller"
                                className="absolute inset-0 w-full h-full object-cover"
                                fill
                            />
                            <CardContent className="absolute bottom-0 left-0 z-10 p-3">
                                <h3 className="text-lg font-bold text-white drop-shadow-lg">{item.name}</h3>
                            </CardContent>
                        </Card>
                    ))


                    อย่าลบ
                    data?.map((value, index) => (
                        <Card key={index} className="relative w-full h-32 overflow-hidden cursor-pointer" onClick={() => somethingclick({ name: value.name, character: value.character, fortunetellerid: value.id })} >
                            <img
                                src={value.mediaId.url || "/image.png"}
                                alt="Fortune Teller"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <CardContent className="absolute bottom-0 left-0 z-10 p-3">
                                <h3 className="text-lg font-bold text-white drop-shadow-lg">{value.name}</h3>
                            </CardContent>
                        </Card>
                    ))

                }
            </div>*/}
            <div className="flex h-full gap-3">
                <div className="flex-3 flex gap-3 h-full transition-all">
                    {data?.slice(0, 3).map((item) => (
                        <Tilt
                            rotationFactor={8}
                            className={`relative flex-1 hover:flex-2 transition-all duration-400  w-full h-full overflow-hidden`}
                            isRevese
                            key={item.id}
                        >
                            <Card
                                key={item.name}
                                className="relative w-full h-full overflow-hidden"
                                // onClick={() =>
                                //     handleAnswerGpt({
                                //         id: item.id,
                                //         name: item.name,
                                //         character: item.character,
                                //     })
                                // }
                            >
                                <Image
                                    src={item.media.url}
                                    alt="Fortune Teller"
                                    className="absolute inset-0 w-full h-full object-center object-cover cursor-pointer"
                                    width={200}
                                    height={200}
                                />
                                <CardContent className="absolute bottom-0 left-0 z-10 p-4">
                                    <h3 className="text-2xl font-bold text-white drop-shadow-lg text-center hidden md:flex">
                                        {item.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        </Tilt>
                    ))}
                </div>
                <div className="flex-1 hidden lg:flex flex-col gap-3">
                    {card.map((item, index) => (
                        <Card key={index} className={`relative h-32 overflow-hidden group`}>
                            <CardContent className={`h-full`}>
                                <div className={`flex h-full items-center text-xl`}>
                                    {item.name}
                                </div>
                                <div
                                    className={` absolute right-0 top-10 group-hover:-right-10 duration-700 transition-all`}
                                >
                                    <Image
                                        src={item.image}
                                        alt={`card-${index}`}
                                        width={200}
                                        height={200}
                                        className={`rounded-md rotate-30 w-40 transition-all duration-700 group-hover:-rotate-30`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
