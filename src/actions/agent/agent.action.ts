"use server";

import { ActionResponse } from "@/types/action.types";
import { BuildPrompt, saveAgentResponse } from "./agent.service";
import { getDeckById } from "../deck/deck.action";
import { OpenAi } from "@/lib/openai";

interface Card {
    meaning: string;
    cardname: string;
    card_nickname: string;
    mediaURL: string;
}

interface Res {
    card: Card[];
    conclade: string;
}

interface GptAnswerSchema {
    res: Res;
}

export interface AgentPredictionResponse {
    cards: Card[];
    summary: string;
}

interface AgentPredictionOptions {
    user_id: string;
    prompt: string;
    fortune_teller_id: string;
    deck_id: string;
    cardName: string;
    card_description: string;
    card_nickname: string;
    birthdate: string;
    catagory: string;
}

export const AgentPrediction = async ({
    deck_id,
    prompt,
    user_id,
    catagory,
    fortune_teller_id,
    birthdate,
    cardName,
    card_nickname,
    card_description,
}: AgentPredictionOptions): ActionResponse<AgentPredictionResponse> => {
    try {
        if (!prompt) {
            throw new Error("prompt is required");
        }

        const checkData = await OpenAi({
            messages: [
                {
                    role: "system",
                    content: `คุณเป็นตัวตรวจสอบหมวดหมู่ข้อความเกี่ยวกับ ${catagory}
ให้ตอบเพียง **YES**   
ให้ตอบ **NO** ถ้าข้อความไม่เกี่ยวกับ ${catagory}

ห้ามตอบคำอื่นนอกจาก YES หรือ NO เท่านั้น`,
                },
                { role: "user", content: prompt },
            ],
            max_tokens: 10,
            temperature: 0,
        });

        const checkContent = checkData.choices?.[0]?.message?.content?.trim().toUpperCase();
        const isLoveRelated = checkContent === "YES";
        if (!isLoveRelated) {
            throw new Error(`คำถามนี้ไม่เกี่ยวกับ ${catagory} กรุณาเลือกหมวดหมู่ให้ตรงกับคำถาม`);
        }

        const deck = await getDeckById(deck_id);

        // ---------- ขั้นตอน 2: ทำนายความ ----------
        const { systemPrompt } = await BuildPrompt({
            prompt,
            fortune_teller_id,
            cardName,
            card_nickname,
            card_description,
            birthdate,
            catagory,
            deck,
        });

        const userPrompt = `คำถาม: ${prompt} ไพ่ที่ได้: ${cardName}`;
        const predictData = await OpenAi({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            max_tokens: 1500,
            temperature: 0.8,
        });
        const rawPredictionData = predictData.choices?.[0]?.message?.content;

        console.log("rawPredictionData", rawPredictionData);

        const answer: GptAnswerSchema = JSON.parse(rawPredictionData);

        const findMediaUrlByCardName = (CardName: string) => {
            return deck.cards.find((card) => card.name === CardName)?.media.url;
        };

        const result: Card[] = answer.res.card.map((card) => {
            const newCard: Card = {
                cardname: card.cardname,
                card_nickname: card.card_nickname,
                meaning: card.meaning,
                mediaURL: findMediaUrlByCardName(card.cardname) || "",
            };
            return newCard;
        });

        // ---------- ขั้นตอน 3: rate ความแม่นยํา 1-100 ---------

        const rate_prompt = `คำทำนาย: ${prompt} คำตอบ: ${rawPredictionData}`;
        const rateData = await OpenAi({
            messages: [
                {
                    role: "system",
                    content: `คุณต้องบอกว่า คำทำนายที่ให้มามีความแม่นจำมากแค่ไหน โดยเป็นจํานวนเต็มเท่านั้น ตอบแค่ 1 ถึง 100 ห้ามตอบอย่างอื่น`,
                },
                { role: "user", content: rate_prompt },
            ],
            max_tokens: 5,
            temperature: 0,
        });

        await saveAgentResponse({
            prompt,
            response: rawPredictionData,
            experience: parseInt(rateData.choices?.[0]?.message?.content),
            userId: user_id,
            fortuneTellerId: fortune_teller_id,
            deckId: deck_id,
        });

        return {
            success: true,
            message: "Success",
            data: {
                cards: result,
                summary: answer.res.conclade,
            },
        };
    } catch (error: any) {
        console.log(error);

        return { success: false, message: error.message };
    }
};
