"use server";

import { prisma } from "@/lib/prisma";
import {
    getMediaService,
    getMediaUrlByObjectName,
    uploadMediaService,
} from "../media/media.service";
import {
    createFortuneTellerSchema,
    updateFortuneTellerSchma,
    mediaSchema,
} from "./fortuneteller.validation";
import { z } from "zod";
import { getSession } from "../auth/auth.action";
import { ForTuneTellerCategory } from "@prisma/client";

type CreateFortuneTellerData = z.infer<typeof createFortuneTellerSchema>;
type UpdateFortuneTellerData = z.infer<typeof updateFortuneTellerSchma>;
type UpdateFortuneTellerAvatarData = z.infer<typeof mediaSchema>;

export async function createFortuneTeller(user_id: string, data: CreateFortuneTellerData) {
    const validatedData = createFortuneTellerSchema.parse(data);
    const { name, character, media } = validatedData;

    const { id } = await uploadMediaService({
        bucket: "fortuneteller",
        data: media,
        type: "file",
    });

    const fortuneTeller = await prisma.forTuneTeller.create({
        data: {
            name,
            character,
            mediaId: id,
            userId: user_id,
            love: data.love,
            life: data.life,
            finance: data.finance,
            career: data.career,
        },
    });
    return fortuneTeller;
}

export async function getAllFortuneTeller() {
    const session = await getSession();

    if (!session) throw new Error("Unauthorized");

    const fortuneTellers = await prisma.forTuneTeller.findMany({
        where: {
            userId: session.id,
            deleted: false,
        },
        include: {
            media: true,
        },
    });

    const result = await Promise.all(
        fortuneTellers.map(async (item) => {
            const url = await getMediaUrlByObjectName(item.media.bucket, item.media.objectName);

            return {
                ...item,
                media: {
                    ...item.media,
                    url: url,
                },
            };
        }),
    );

    return result;
}

export async function getFortuneTeller(id: string) {
    return await prisma.forTuneTeller.findUnique({
        where: {
            id,
        },
        include: {
            media: true,
        },
    });
}

export async function updateFortuneTeller(data: UpdateFortuneTellerData, id: string) {
    const validatedData = updateFortuneTellerSchma.parse(data);
    const { name, character, love, life, finance, career } = validatedData;

    const updatedFortuneTeller = await prisma.forTuneTeller.update({
        where: { id },
        data: {
            name,
            character,
            love,
            life,
            finance,
            career,
        },
    });

    return updatedFortuneTeller;
}

export async function updateFortuneTellerAvatar(data: UpdateFortuneTellerAvatarData, id: string) {
    const validatedData = mediaSchema.parse(data);
    const { media } = validatedData;

    const { id: mediaId } = await uploadMediaService({
        bucket: "fortuneteller",
        data: media,
        type: "file",
    });

    return await prisma.forTuneTeller.update({
        where: { id },
        data: {
            mediaId,
        },
    });
}

export async function deleteFortuneTellerService(id: string) {
    await prisma.forTuneTeller.update({
        where: { id },
        data: {
            deleted: true,
            deletedAt: new Date(),
        },
    });
}

export async function clientGetFortuneTeller() {
    const client = await prisma.forTuneTeller.findMany({
        where: {
            deleted: false,
        },
        include: {
            media: true,
        },
    });

    const covertmedia = await Promise.all(
        client.map(async (item) => {
            const url = await getMediaUrlByObjectName(item.media.bucket, item.media.objectName);

            return {
                ...item,
                media: {
                    ...item.media,
                    url: url,
                },
            };
        }),
    );

    return covertmedia;
}

export async function getFortuneTellerSortBySkill({
    skill,
    skip,
    take,
}: {
    skill: ForTuneTellerCategory;
    skip?: number;
    take?: number;
}) {
    const SKIP = skip || 0;
    const TAKE = take || 10;

    const skillFieldMap = {
        Love: "love",
        Life: "life",
        Finance: "finance",
        Career: "career",
    };

    const orderField = skillFieldMap[skill];

    const fortuneTellers = await prisma.forTuneTeller.findMany({
        where: {
            deleted: false,
        },
        include: {
            media: true,
        },
        orderBy: {
            [orderField]: "desc",
        },
        skip: SKIP,
        take: TAKE,
    });

    const result = await Promise.all(
        fortuneTellers.map(async (item) => {
            const url  = await getMediaUrlByObjectName(item.media.bucket, item.media.objectName);

            return {
                ...item,
                media: {
                    ...item.media,
                    url: url,
                },
            };
        }),
    );

    return result;
}
