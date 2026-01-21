"use server";

import { ActionResponse } from "@/types/action.types";
import {
    createDeckService,
    deleteDeckService,
    getDeckByIdService,
    getDecksService,
    updateDeckService,
} from "./deck.service";
import { Prisma } from "@prisma/client";
import { MediaResponse } from "../media/media.service";
import {
    createDeckSchema,
    CreateDeckSchema,
    updateDeckSchema,
    UpdateDeckSchema,
} from "./deck.validation";
import { getSession } from "../auth/auth.action";
import { taro } from "@/utils/tarocard.json";
import { poker } from "@/utils/poker.json";

type CardResponse = Prisma.DeckCardGetPayload<{}> & { media: MediaResponse };

export type getDeckByIdResponse = Prisma.DeckGetPayload<{}> & { cards: CardResponse[] };

export async function getDeckById(id: string): Promise<getDeckByIdResponse> {
    const deck = await getDeckByIdService(id);

    return deck;
}

export type CardCategory = "LOVE" | "LIFE" | "FINANCE" | "CAREER";

export async function getDeckByIdWithCategory(
    id: string,
    category: CardCategory,
): Promise<CardResponse[]> {
    const { cards, type } = await getDeckById(id);

    if (type === "TARO") {
        const originalCardFiltered = [
            ...taro["Major Arcana"],
            ...taro["Minor Arcana"].cupcard,
            ...taro["Minor Arcana"].coincard,
            ...taro["Minor Arcana"].woodcard,
            ...taro["Minor Arcana"].swordcard,
        ].filter((card) => {
            if (!card.category) return false;

            return card.category.includes(category);
        });

        const result = cards.filter((card) => {
            const isFound = originalCardFiltered.find(
                (originalCard) => originalCard.name_th === card.name,
            );

            if (isFound) return true;
            else return false;
        });

        return result;
    } else if (type === "POKER") {
        const originalCardFiltered = poker.filter((card) => {
            if (!card.category) return false;

            return card.category.includes(category);
        });

        const result = cards.filter((card) => {
            const isFound = originalCardFiltered.find(
                (originalCard) => originalCard.name_th === card.name,
            );

            if (isFound) return true;
            else return false;
        });

        return result;
    } else {
        return cards;
    }
}

export type getDecksResponse = getDeckByIdResponse[];

export async function getDecks(take: number, skip: number): Promise<getDecksResponse> {
    const decks = await getDecksService(take, skip);

    return decks;
}

export async function getOwnDecks(take: number, skip: number): Promise<getDecksResponse> {
    try {
        const session = await getSession();

        if (!session) throw new Error("Unauthorized");

        const decks = await getDecksService(take, skip, { userId: session.id });

        return decks;
    } catch (error) {
        return [];
    }
}

export async function createDeck(data: CreateDeckSchema): ActionResponse<null> {
    try {
        const session = await getSession();

        if (!session) throw new Error("Unauthorized");

        const validation = createDeckSchema.parse(data);

        await createDeckService(session.id, validation);

        return {
            success: true,
            message: "Deck created successfully",
            data: null,
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateDeck(data: UpdateDeckSchema): ActionResponse<null> {
    try {
        const session = await getSession();

        if (!session) throw new Error("Unauthorized");

        const validation = updateDeckSchema.parse(data);

        await updateDeckService(validation);

        return {
            success: true,
            message: "Deck update successfully",
            data: null,
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteDeck(id: string): ActionResponse<null> {
    try {
        await deleteDeckService(id);

        return {
            success: true,
            message: "Deck deleted successfully",
            data: null,
        };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
