"use client"
import { useState, useEffect } from "react"
import Image from "next/image";
import { TextEffect } from '@/components/ui/text-effect';
import { SearchBar } from "@/components/common/search"
import { Tilt } from '@/components/ui/tilt';
import { motion, number } from "framer-motion";
import TarotCard from "@/utils/tarocard.json"
import ListFortuneTeller from "./listfortuneteller";

const NoSignInContainer = () => {
    const [fin, setFin] = useState<boolean>(false)
    const textPresent = ['ความรัก','การงาน','สุขภาพ','การเรียน & การงาน']
    const [text, setText] = useState<string>("ความรัก")
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    function getTarotCard( amount:number){
        return TarotCard.taro["Major Arcana"].filter((item, index) => index < amount).map((item) => item.image)
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % textPresent.length
                setText(textPresent[nextIndex])
                return nextIndex
            })
            setFin(prev => !prev)
        }, 3000) // Change text every 3 seconds

        // Set initial text
        setText(textPresent[0])

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div className="w-full h-98 relative">
                <div className={` absolute inset-0 bg-linear-0 from-black to-transparent`}></div>
                <Image
                    alt="topground"
                    src="/background/background1.jpg"
                    width={1080}
                    height={920}
                    className="w-full h-full object-cover select-none"
                />
                <div className="absolute top-14 w-full left-1/2 *:text-white -translate-x-1/2 flex flex-col items-center gap-5">
                    <span className="text-bold text-2xl">ครบทุกบริการดูดวงด้าน…</span>
                    <TextEffect
                        key={text}
                        per="char"
                        preset="blur"
                        onAnimationComplete={() => setFin(!fin)}
                        className={`text-4xl md:text-5xl`}
                        speedSegment={0.5}
                        speedReveal={0.5}
                    >
                        {text}
                    </TextEffect>
                    <span className="text-bold text-xl">ที่พร้อมเปลี่ยนไอเดียของคุณให้เป็นความจริง</span>
                    <div className={`hidden sm:flex`}>
                        <SearchBar width={`500`} />
                    </div>
                    <div className={`flex sm:hidden`}>
                        <SearchBar width={`300`} />
                    </div>
                </div>
            </div>
            <div className={` px-4 md:px-14 -translate-y-16 flex flex-col gap-10 BGImage`}>
                <div className={'w-full h-90 md:h-110 p-3 md:p-9 bg-card rounded-md shadow-md'}>
                    <ListFortuneTeller/>
                </div>
                <div className="w-full h-[180px] relative">
                    <Image src={`/banner/banner2.jpg`} alt={`banner`} fill className=" object-cover rounded-md" />
                </div>
                <div className={`flex flex-col gap-10`}>
                    <div className={` flex justify-center items-center flex-col gap-2`}>
                        <span className={`text-3xl text-center`}>คำแนะนำที่ดีประจำเดือน</span>
                        <span className={`text-base text-center`}>เปิดเผยคำทำนายและแนวทางชีวิตที่ดีที่สุดสำหรับคุณในเดือนนี้</span>
                    </div>
                    <div className={`flex flex-col md:flex-row gap-10`}>
                        <div className="flex-1 flex justify-between text-sm space-y-2">
                            <ul className="space-y-1.5 *:text-base list-disc list-inside">
                                <li>ช่วยให้มองเห็นเส้นทางที่เหมาะสมและการตัดสินใจที่สำคัญในช่วงเวลาที่กำลังเผชิญอยู่</li>
                                <li>มองเห็นโอกาส อุปสรรค และแนวทางในการพัฒนาตัวเองเพื่อความก้าวหน้าในหน้าที่การงาน</li>
                                <li>เข้าใจความสัมพันธ์และเรื่องรักในมุมมองใหม่</li>
                                <li>เสริมสร้างสุขภาพกายและใจให้สมดุล</li>
                                <li>คาดการณ์แนวโน้มการเงินและโชคลาภ</li>
                                <li>ปลดล็อกพลังงานบวกและความเป็นสิริมงคล</li>
                                <li>เตือนล่วงหน้าถึงเหตุการณ์สำคัญที่กำลังจะเกิดขึ้น</li>
                                <li>ช่วยวางแผนและกำหนดกลยุทธ์สำหรับอนาคตอย่างมีประสิทธิภาพ</li>
                                <li>พัฒนาการรับรู้และความไว ของสัญชาตญาณภายใน</li>
                            </ul>
                        </div>
                        <div className={`flex gap-4 flex-1`}>
                            {['/backcard/career.jpg','/backcard/heath.jpg','/backcard/love.jpg'].map((items,index) => (
                                <motion.div initial={{y:40, opacity:0}} whileInView={{y:0,opacity:1}} transition={{delay:index/10, duration:0.5}} key={index} >
                                    <Tilt rotationFactor={8} isRevese>
                                        <Image src={items} className={`rounded-md`} width={200} height={200} alt={`card-${index}`} />
                                    </Tilt>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    {/*<div>
                        awd;kfpw
                    </div>*/}
                    <div className="backdrop-blur-md py-4 flex flex-col gap-4">
                        <div className="flex justify-center items-center flex-col gap-3">
                            <span className="text-center text-3xl">คำทำนายประจำวัน</span>
                            <span className="text-center">No sea nonumy ut aliquyam velit justo quis sed erat takimata voluptua ut et eros vel illum et nonumy ad</span>
                        </div>
                        <div className={`flex justify-evenly flex-wrap gap-4`}>
                            {getTarotCard(5).map((items,index) => (
                                <motion.div initial={{y:40, opacity:0}} whileInView={{y:0,opacity:1}} transition={{delay:index/10, duration:0.5}} key={index} >
                                    <Tilt rotationFactor={8} isRevese>
                                        <Image src={items} className={`rounded-md w-28 md:w-50`} width={200} height={200} alt={`card-${index}`} />
                                    </Tilt>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NoSignInContainer
