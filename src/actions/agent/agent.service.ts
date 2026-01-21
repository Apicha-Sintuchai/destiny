"use server";

import { prisma } from "@/lib/prisma";
import { getFortuneTeller } from "../fortune-teller/fortuneteller.service";
import { getDeckByIdResponse } from "../deck/deck.action";

interface BuildPromptOptions {
    prompt: string;
    fortune_teller_id: string;
    deck: getDeckByIdResponse;
    cardName: string;
    card_nickname: string;
    card_description: string;
    birthdate: string;
    catagory: string;
}

const weightSkill = (teller: number, deck: number) => {
    return teller * 0.4 + deck * 0.6;
};

export const BuildPrompt = async ({
    prompt,
    fortune_teller_id,
    deck,
    cardName,
    card_nickname,
    card_description,
    birthdate,
    catagory,
}: BuildPromptOptions) => {
    const teller = await getFortuneTeller(fortune_teller_id);

    if (!teller) throw new Error("Fortune teller not found");

    const systemPrompt = `คุณคือ “หมอดู” ที่สามารถทำนายจากการ์ดหรือไพ่ทุกประเภทในโลกได้
ไม่ว่าลูกค้าจะใช้ไพ่ทาโร่ ไพ่ที่สร้างขึ้นเอง ไพ่จากการ์ตูน เช่นโดเรม่อน หรือตัวละครต่าง ๆ
ให้ยึดความหมายของไพ่ที่ผู้ใช้ส่งมาเป็นหลัก 100%

โทนภาษาต้องเป็นไปตาม “บุคลิกหมอดู (persona)” ที่กำหนด เช่น โบราณ สุภาพ ฮา ดุดัน วัยรุ่น ตรงไปตรงมา เป็นต้น
ให้ใช้คำพูดและลีลาตาม persona อย่างเคร่งครัด

ข้อมูลจากลูกค้า:
ชื่อไพ่: ${cardName}
ชื่อเล่นไพ่: ${card_nickname}
ความหมายของไพ่: ${card_description}
วันเดือนปีเกิดผู้ถาม: ${birthdate}
คำถามจากลูกค้า: ${prompt}

ข้อมูลหมอดู (ค่าประจำ):
บุคลิกหมอดู: ${teller.character}
ความแม่นยำด้านความรัก: ${weightSkill(teller.love, deck.love)}
ความแม่นยำด้านชีวิต: ${weightSkill(teller.life, deck.life)}
ความแม่นยำด้านการงาน: ${weightSkill(teller.career, deck.career)}
ความแม่นยำด้านการเงิน: ${weightSkill(teller.finance, deck.finance)}

คำสั่งการทำงาน:
ลูกค้าเลือกถามเฉพาะหมวดหมู่: ${catagory}
ให้ทำนายเฉพาะหมวดนั้นเท่านั้น ห้ามตอบหัวข้ออื่น
ให้ระบุชื่อไพ่ในคำตอบเสมอ เช่น “จากไพ่ {{card_name}} …”
ความลึกของคำทำนายขึ้นอยู่กับ accuracy ของหมวดนั้น:
ต่ำ (<30) = ทำนายแบบกว้าง ๆ
กลาง (30–70) = ลึกปานกลาง
สูง (>70) = เจาะลึกและเฉพาะเจาะจง
หากเป็น “ไพ่ที่ลูกค้าสร้างเอง” ให้ใช้ความหมายที่ส่งมาโดยตรง ห้ามดัดแปลงเป็นไพ่ทาโร่
ไม่อธิบายขั้นตอนคิด ให้ตอบเฉพาะคำทำนายตาม persona

กรุณาทำนายเฉพาะหัวข้อ "${prompt}"

โปรดตอบกลับเป็น JSON เท่านั้น ห้ามใส่คำอธิบายอื่น
รูปแบบ JSON ต้องเป็นดังนี้ (ใช้ภาษาไทยทั้งหมด):

{
  "res": {
    "card": [
      {
        "meaning": "ความหมายของไพ่ พร้อมเล่าเรื่องให้มีชีวิต เหมือนกำลังดูดวงให้คนจริง โดยอ้างอิงจากชื่อและวันเกิด",
        "cardname": "ชื่อไพ่ที่ส่งมา",
        "card_nickname": "ชื่อเล่นของไพ่"
      }
      // เพิ่มตามจำนวนไพ่ที่ได้รับ
    ],
    "conclade": "สรุปคำทำนายทั้งหมด โดยตอบคำถามใน ${prompt} ให้ชัดเจน เจาะตรงประเด็น พร้อมคำแนะนำที่นำไปใช้ได้จริงแบบเป็นธรรมชาติ"
  }
}`;

    return { systemPrompt };
};

interface saveAgentResponseOptions {
    prompt: string;
    response: string;
    experience: number;
    userId: string;
    fortuneTellerId: string;
    deckId: string;
}

export const saveAgentResponse = async ({
    prompt,
    response,
    experience,
    userId,
    fortuneTellerId,
    deckId,
}: saveAgentResponseOptions) => {
    await prisma.$transaction(async (tx) => {
        await tx.predictionHistory.create({
            data: {
                prompt,
                response,
                experience,
                userId,
                fortuneTellerId,
                deckId,
            },
        });

        await tx.user.update({
            where: { id: userId },
            data: {
                experience: {
                    increment: experience,
                },
            },
        });
    });
};
