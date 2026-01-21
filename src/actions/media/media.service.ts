"use server";

import { getFileUrl, uploadFile } from "@/lib/minio";
import { prisma } from "@/lib/prisma";
import sharp from "sharp";
import { fileToBuffer } from "@/lib/file";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export type MediaResponse = Prisma.MediaGetPayload<{}> & {
    url: string;
};

interface uploadMediaServiceOptions {
    bucket: string;
}

interface uploadMediaServiceFileOptions extends uploadMediaServiceOptions {
    data: File;
    type: "file";
}

type uploadMediaServiceOptionsType = uploadMediaServiceFileOptions;

export const uploadMediaService = async ({ data, bucket }: uploadMediaServiceOptionsType) => {
    const buffer = await fileToBuffer(data);

    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error("Invalid image buffer");
    }

    let fileName = `destiny-${uuidv4()}.webp`;
    const finalBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

    await uploadFile(bucket, fileName, finalBuffer);

    const media = await prisma.media.create({
        data: {
            bucket,
            objectName: fileName,
        },
    });

    return media;
};

export const uploadMediaBatchSerivce = async (batch: uploadMediaServiceOptionsType[]) => {
    const result = await Promise.all(
        batch.map(async (item) => {
            const buffer = await fileToBuffer(item.data);

            const fileName = `destiny-${uuidv4()}.webp`;
            const finalBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();

            await uploadFile(item.bucket, fileName, finalBuffer);

            return { bucket: item.bucket, objectName: fileName };
        }),
    );

    const media = await prisma.media.createMany({
        data: result,
    });

    return media;
};

export const getMediaService = async (id: string): Promise<MediaResponse> => {
    const media = await prisma.media.findUnique({
        where: {
            id: id,
        },
    });

    if (!media) throw new Error("Media not found");

    const url = await getFileUrl(media.bucket, media.objectName);

    return {
        ...media,
        url: url,
    };
};

export const getMediaUrlByObjectName = async (bucket: string, objectName: string) => {
    return await getFileUrl(bucket, objectName);
};
