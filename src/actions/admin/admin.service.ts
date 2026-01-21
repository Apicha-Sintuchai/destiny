"use server";

import { prisma } from "@/lib/prisma";

const VIP_SETTING_KEY = "vip_credit_price";

export const getVipSetting = async () => {
    return await prisma.setting.findUnique({
        where: {
            name: VIP_SETTING_KEY,
        },
    });
};

export const setVipCreditPriceService = async (price: number) => {
    const setting = await getVipSetting();
    if (!setting) {
        await prisma.setting.create({
            data: {
                name: VIP_SETTING_KEY,
                value: price.toString(),
            },
        });
    } else {
        await prisma.setting.update({
            where: {
                name: VIP_SETTING_KEY,
            },
            data: {
                value: price.toString(),
            },
        });
    }
};

export const getUsers = async (take: number, skip: number) => {
    return await prisma.user.findMany({
        where: {
            deleted: false,
        },
        take,
        skip,
        select: {
            id: true,
            phoneNumber: true,
            firstname: true,
            lastname: true,
            birthday: true,
            credit: true,
            experience: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            Subscription: {
                select: {
                    id: true,
                    status: true,
                    startAt: true,
                    expiryAt: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const getUsersCount = async () => {
    return await prisma.user.count({
        where: {
            deleted: false,
        },
    });
};
