"use server";

import { prisma } from "@/lib/prisma";
import { getMediaUrlByObjectName, uploadMediaService } from "../media/media.service";
import { CreateDeckSchema, UpdateDeckSchema } from "./deck.validation";
import { Prisma } from "@prisma/client";

const logger = {
    info: (action: string, message: string, data?: Record<string, unknown>) => {
        console.log(
            `[DECK-SERVICE][INFO][${new Date().toISOString()}] ${action}: ${message}`,
            data ? JSON.stringify(data, null, 2) : "",
        );
    },
    error: (action: string, message: string, error?: unknown) => {
        console.error(
            `[DECK-SERVICE][ERROR][${new Date().toISOString()}] ${action}: ${message}`,
            error,
        );
    },
    debug: (action: string, message: string, data?: Record<string, unknown>) => {
        console.log(
            `[DECK-SERVICE][DEBUG][${new Date().toISOString()}] ${action}: ${message}`,
            data ? JSON.stringify(data, null, 2) : "",
        );
    },
};

export async function getDeckByIdService(id: string) {
    logger.info("getDeckById", "เริ่มค้นหา deck", { deckId: id });

    const deck = await prisma.deck.findFirst({
        where: { id },
        include: {
            cards: {
                include: { media: true },
            },
        },
    });

    if (!deck) {
        logger.error("getDeckById", "ไม่พบ deck", { deckId: id });
        throw new Error("Deck not found");
    }

    logger.info("getDeckById", "พบ deck สำเร็จ", {
        deckId: id,
        deckName: deck.name,
        cardCount: deck.cards.length,
    });

    logger.debug("getDeckById", "เริ่มโหลด media สำหรับแต่ละ card", {
        cardCount: deck.cards.length,
    });

    const result = await Promise.all(
        deck.cards.map(async (card, index) => {
            logger.debug(
                "getDeckById",
                `กำลังโหลด media สำหรับ card ${index + 1}/${deck.cards.length}`,
                {
                    cardId: card.id,
                    cardName: card.name,
                    mediaId: card.mediaId,
                },
            );

            const url = await getMediaUrlByObjectName(card.media.bucket, card.media.objectName);

            logger.debug("getDeckById", `โหลด media สำหรับ card ${index + 1} สำเร็จ`, {
                cardId: card.id,
            });

            return {
                ...card,
                media: {
                    ...card.media,
                    url: url,
                },
            };
        }),
    );

    logger.info("getDeckById", "ดึงข้อมูล deck พร้อม media ทั้งหมดสำเร็จ", {
        deckId: id,
        totalCards: result.length,
    });

    return {
        ...deck,
        cards: result,
    };
}

export async function getDecksService(take: number, skip: number, where?: Prisma.DeckWhereInput) {
    logger.info("getDecks", "เริ่มดึงรายการ decks", {
        take,
        skip,
        whereConditions: where ? Object.keys(where) : [],
    });

    const decks = await prisma.deck.findMany({
        take,
        skip,
        where: { ...where, deleted: false },
        include: { cards: { include: { media: true } } },
    });

    logger.info("getDecks", `พบ ${decks.length} decks`, {
        deckCount: decks.length,
        deckIds: decks.map((d) => d.id),
    });

    logger.debug("getDecks", "เริ่มโหลด media สำหรับทุก decks");

    const result = await Promise.all(
        decks.map(async (deck, deckIndex) => {
            logger.debug(
                "getDecks",
                `กำลังโหลด cards สำหรับ deck ${deckIndex + 1}/${decks.length}`,
                {
                    deckId: deck.id,
                    deckName: deck.name,
                    cardCount: deck.cards.length,
                },
            );

            const cards = await Promise.all(
                deck.cards.map(async (card, cardIndex) => {
                    logger.debug(
                        "getDecks",
                        `กำลังโหลด media สำหรับ card ${cardIndex + 1}/${deck.cards.length} ใน deck ${deck.name}`,
                        {
                            cardId: card.id,
                            mediaId: card.mediaId,
                        },
                    );

                    const url = await getMediaUrlByObjectName(
                        card.media.bucket,
                        card.media.objectName,
                    );

                    return {
                        ...card,
                        media: {
                            ...card.media,
                            url: url,
                        },
                    };
                }),
            );

            logger.debug("getDecks", `โหลด cards สำหรับ deck ${deck.name} สำเร็จ`, {
                deckId: deck.id,
                loadedCards: cards.length,
            });

            return {
                ...deck,
                cards: cards,
            };
        }),
    );

    logger.info("getDecks", "ดึงรายการ decks ทั้งหมดสำเร็จ", {
        totalDecks: result.length,
        totalCards: result.reduce((sum, deck) => sum + deck.cards.length, 0),
    });

    return result;
}

export async function createDeckService(user_id: string, data: CreateDeckSchema) {
    logger.info("createDeck", "เริ่มสร้าง deck ใหม่", {
        userId: user_id,
        deckName: data.name,
        cardCount: data.cards.length,
        skills: {
            love: data.love,
            life: data.life,
            finance: data.finance,
            career: data.career,
        },
        type: data.type,
    });

    const deck = await prisma.deck.create({
        data: {
            name: data.name,
            userId: user_id,
            description: data.description,
            love: data.love,
            life: data.life,
            finance: data.finance,
            career: data.career,
            type: data.type,
        },
    });

    logger.info("createDeck", "สร้าง deck สำเร็จ", {
        deckId: deck.id,
        deckName: deck.name,
    });

    logger.debug("createDeck", `เริ่มอัปโหลด media สำหรับ ${data.cards.length} cards`);

    const cardData = await Promise.all(
        data.cards.map(async (card, index) => {
            logger.debug(
                "createDeck",
                `กำลังอัปโหลด media สำหรับ card ${index + 1}/${data.cards.length}`,
                {
                    cardName: card.name,
                },
            );

            try {
                const { id } = await uploadMediaService({
                    bucket: "deck",
                    data: card.media,
                    type: "file",
                });

                logger.debug("createDeck", `อัปโหลด media สำหรับ card ${card.name} สำเร็จ`, {
                    cardName: card.name,
                    mediaId: id,
                });

                return {
                    name: card.name,
                    nickName: card.nickName,
                    description: card.description,
                    mediaId: id,
                    deckId: deck.id,
                };
            } catch (error) {
                logger.error("createDeck", `อัปโหลด media สำหรับ card ${card.name} ล้มเหลว`, error);
                return null;
            }
        }),
    );

    const cardResult = cardData.filter((card) => card !== null);
    const failedCards = data.cards.length - cardResult.length;

    if (failedCards > 0) {
        logger.error("createDeck", `มี ${failedCards} cards ที่อัปโหลด media ล้มเหลว`, {
            total: data.cards.length,
            success: cardResult.length,
            failed: failedCards,
        });
    }

    logger.debug("createDeck", "กำลังบันทึก cards ลงฐานข้อมูล", {
        cardCount: cardResult.length,
    });

    await prisma.deckCard.createMany({
        data: cardResult,
    });

    logger.info("createDeck", "สร้าง deck พร้อม cards ทั้งหมดสำเร็จ", {
        deckId: deck.id,
        deckName: deck.name,
        totalCards: cardResult.length,
        userId: user_id,
    });

    return deck;
}

export async function updateDeckService(data: UpdateDeckSchema) {
    const deckData: Record<string, string | number> = {};

    if (data.name !== undefined) deckData.name = data.name;
    if (data.description !== undefined) deckData.description = data.description;
    if (data.love !== undefined) deckData.love = data.love;
    if (data.life !== undefined) deckData.life = data.life;
    if (data.finance !== undefined) deckData.finance = data.finance;
    if (data.career !== undefined) deckData.career = data.career;

    await prisma.deck.update({
        where: { id: data.id },
        data: deckData,
    });

    await Promise.all(
        data.cards.map(async (card) => {
            const cardData: Record<string, string> = {};
            if (card.name !== undefined) cardData.name = card.name;
            if (card.nickName !== undefined) cardData.nickName = card.nickName;
            if (card.description !== undefined) cardData.description = card.description;

            console.log("cardData", cardData);

            if (card.media) {
                const { id } = await uploadMediaService({
                    bucket: "deck",
                    data: card.media,
                    type: "file",
                });

                cardData.mediaId = id;
            }

            await prisma.deckCard.update({
                where: { id: card.id },
                data: cardData,
            });
        }),
    );
}

export async function deleteDeckService(id: string) {
    logger.info("deleteDeck", "เริ่มลบ deck (soft delete)", { deckId: id });

    try {
        await prisma.deck.update({
            where: { id },
            data: {
                deleted: true,
                deletedAt: new Date(),
            },
        });

        logger.info("deleteDeck", "ลบ deck สำเร็จ", {
            deckId: id,
            deletedAt: new Date().toISOString(),
        });
    } catch (error) {
        logger.error("deleteDeck", "ลบ deck ล้มเหลว", error);
        throw error;
    }
}
