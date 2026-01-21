"use server";

import { taro } from "@/utils/tarocard.json";
import { lenormand } from "@/utils/lenormand.json";
import { poker } from "@/utils/poker.json";
import sharp from "sharp";

export type CardType = "TARO" | "LENORMAND" | "POKER";

export async function fetchCards(type: CardType) {
    const major = taro["Major Arcana"];
    const minor = taro["Minor Arcana"];

    const taroCards =
        type === "TARO"
            ? [...major, ...minor.cupcard, ...minor.coincard, ...minor.woodcard, ...minor.swordcard]
            : type === "LENORMAND"
              ? lenormand
              : poker;

    const result = await Promise.all(
        taroCards.map(async (card) => {
            const proxy = await fetchImageProxy(card.image);

            if (!proxy) return card;

            const resized = await sharp(proxy.buffer).resize(512).toBuffer();

            const buffer = new Buffer(resized)

            const filename = card.image.split("/").pop() || "card.jpg";
            const file = new File([buffer], filename, { type: proxy.contentType });

            return {
                ...card,
                image: file,
            };
        }),
    );

    return result;
}

export async function fetchImageProxy(imageUrl: string) {
    try {
        if (!imageUrl) return null;

        const res = await fetch(imageUrl, {
            // cache: "force-cache",
            // next: { revalidate: 60 * 60 * 24 },
        });

        if (!res.ok) {
            console.error("Failed to fetch:", res.status);
            return null;
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const contentType = res.headers.get("content-type") ?? "image/jpeg";

        const base64 = buffer.toString("base64");

        console.log("Proxy response:", imageUrl);

        return {
            contentType,
            base64,
            buffer,
        };
    } catch (err) {
        console.error("Proxy error:", err);
        return null;
    }
}
