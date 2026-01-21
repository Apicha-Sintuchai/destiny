import { prisma } from "@/lib/prisma";
import { getVipSetting } from "../admin/admin.service";
import { addDays } from "date-fns";

export async function getUserService(id?: string) {
    if (!id) {
        throw new Error("User not found");
    }

    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export async function getSubscribedUser(userId: string) {
    return await prisma.subscription.findUnique({
        where: {
            userId,
        },
    });
}

export async function isSubscribedService(userId: string) {
    const subscription = await getSubscribedUser(userId);

    if (!subscription) throw new Error("Subscription not found");

    if (subscription.expiryAt < new Date()) throw new Error("Subscription expired");

    return subscription;
}

export async function purchaseVipService(userId: string) {
    const user = await getUserService(userId);

    const vipSetting = await getVipSetting();

    if (user.credit < Number(vipSetting?.value)) throw new Error("จํานวนเงินไม่เพียงพอ");

    const subscription = await getSubscribedUser(userId);

    await prisma.$transaction(async (tx) => {
        await tx.user.update({
            where: {
                id: userId,
            },
            data: {
                credit: {
                    decrement: Number(vipSetting?.value),
                },
            },
        });

        if (!subscription) {
            await tx.subscription.create({
                data: {
                    userId,
                    status: "ACTIVE",
                    startAt: new Date(),
                    expiryAt: addDays(new Date(), 30),
                },
            });
        } else {
            const now = new Date();
            const baseDate = subscription.expiryAt > now ? subscription.expiryAt : now;

            await tx.subscription.update({
                where: { userId },
                data: {
                    status: "ACTIVE",
                    startAt: now,
                    expiryAt: addDays(baseDate, 30),
                },
            });
        }

        await tx.transaction.create({
            data: {
                type: "SUBSCRIPTION",
                amount: Number(vipSetting?.value),
                userId: userId,
            },
        });
    });
}
