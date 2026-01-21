"use client";

import CarouselComponent from "@/components/carousel";
import { FortuneTellerSkill } from "@/types/fortuneteller";
import Image from "next/image";

const SignInContainer = ({
    love_fortunteller,
    career_fortunteller,
    finance_fortunteller,
    life_fortunteller,
}: {
    love_fortunteller: FortuneTellerSkill[];
    life_fortunteller: FortuneTellerSkill[];
    finance_fortunteller: FortuneTellerSkill[];
    career_fortunteller: FortuneTellerSkill[];
}) => {
    const categories = [
        {
            title: "💝 หมอดูเรื่องความรัก",
            data: love_fortunteller,
            gradient: "from-pink-500/10 to-rose-500/10",
        },
        {
            title: "💼 หมอดูเรื่องการงาน",
            data: career_fortunteller,
            gradient: "from-blue-500/10 to-cyan-500/10",
        },
        {
            title: "💰 หมอดูเรื่องการเงิน",
            data: finance_fortunteller,
            gradient: "from-yellow-500/10 to-amber-500/10",
        },
        {
            title: "✨ หมอดูเรื่องชีวิต",
            data: life_fortunteller,
            gradient: "from-purple-500/10 to-indigo-500/10",
        },
    ];

    console.log(categories)

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-900 via-black to-gray-900">
            <div className="relative pt-20 pb-12 px-6 md:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text ">
                            ค้นหาหมอดูที่ใช่สำหรับคุณ
                        </h1>
                        <p className="text-gray-400 text-lg">
                            หมอดูมืออาชีพพร้อมให้คำปรึกษา ทำนายอนาคต ชี้ทางชีวิต
                        </p>
                    </div>
                </div>
            </div>
            <div className={`w-full h-30 md:h-50 px-6 pb-6 overflow-hidden relative`}>
                <Image loading="lazy" src={`/banner/banner3.jpg`} alt="banner" width={800} height={400} className={` object-cover rounded-md w-full h-full`}/>
            </div>

            <div className="space-y-12 pb-20">
                {categories.map((category) => (
                    <div key={category.title} className="relative mb-20">
                        <div
                            className={`absolute inset-0 bg-linear-to-r ${category.gradient} blur-3xl opacity-20`}
                        ></div>

                        <div className="relative px-6 md:px-10">
                            <div className="max-w-7xl mx-auto">
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                                        {category.title}
                                    </h2>
                                    <button className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-semibold flex items-center gap-2">
                                        ดูทั้งหมด
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div className={``}>
                                    <CarouselComponent data={category.data} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SignInContainer;
