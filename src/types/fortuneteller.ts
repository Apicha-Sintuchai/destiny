import { Prisma } from "@prisma/client";

export type FortuneTeller = Prisma.ForTuneTellerGetPayload<{}> & {
    media: {
        id: string;
        createdAt: Date;
        bucket: string;
        objectName: string;
        url: string;
    };
};

export type FortuneTellerSkill = Prisma.ForTuneTellerGetPayload<{}> & {
    media: {
        id: string;
        createdAt: Date;
        bucket: string;
        objectName: string;
        url: string;
    };
};
