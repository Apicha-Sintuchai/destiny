"use server";

import { prisma } from "@/lib/prisma";
import { getUserService } from "../user/user.service";
import { TransactionResponse } from "./topup.types";
import { AccountTopup } from "@prisma/client";
import { UpdateAccountTopupSchema } from "./topup.validation";

export interface AccountTopupOptions {
    promptpay_account: string;
    promptpay_name: string;
    bank_name: string;
    bank_account: string;
    bank_account_name: string;
}


export const getAccountTopup = async (): Promise<AccountTopup | null> => {
    return await prisma.accountTopup.findFirst();
};

export const updateAccountTopup = async (data: UpdateAccountTopupSchema) => {
    const accountTopupExist = await getAccountTopup();

    if (accountTopupExist) {
        const updatedAccountTopup = await prisma.accountTopup.update({
            where: {
                id: accountTopupExist.id,
            },
            data: data,
        });

        return { success: true, message: "อัพเดทเรียบร้อย", data: updatedAccountTopup };
    } else {
        const createdAccountTopup = await prisma.accountTopup.create({
            data: data,
        });

        return { success: true, message: "สร้างเรียบร้อย", data: createdAccountTopup };
    }
};

export const topupActionService = async (payload: string, expectedAmount: number) => {
    const user = await getUserService();

    if (!user) {
        throw new Error("กรุณาเข้าสู่ระบบ");
    }

    if (!payload || typeof payload !== "string" || payload.length < 10) {
        throw new Error("PAYLOAD ไม่ถูกต้อง");
    }

    const apiKey = process.env.RDCW_API_KEY;
    if (!apiKey) {
        throw new Error("ระบบยังไม่ได้ตั้งค่า API KEY");
    }

    const res = await fetch("https://suba.rdcw.co.th/v2/inquiry", {
        method: "POST",
        headers: {
            Authorization: `Basic ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error("ไม่สามารถตรวจสอบข้อมูลได้: " + errorText);
    }

    const result: TransactionResponse = await res.json();
    const data = result.data;

    if (!data) {
        throw new Error("ไม่มีข้อมูลจากระบบ RDCW");
    }

    const amount = Number(data.amount);
    const code = String(data.transRef || payload);

    const existing = await isCodeExist(code);

    if (existing) {
        return {
            success: false,
            message: "❌ สลิปนี้ถูกใช้ไปแล้ว",
        };
    }

    const isAmountMatched = amount === expectedAmount;
    if (!isAmountMatched) {
        return {
            success: false,
            message: `❌ จำนวนเงินไม่ตรงกัน: คาดว่า ${expectedAmount} บาท แต่ได้ ${amount} บาท`,
        };
    }

    const accountTopup = await getAccountTopup();

    if (!accountTopup) {
        throw new Error("ไม่พบข้อมูลบัญชีสำหรับการเติมเงิน");
    }

    const expectedPhone = accountTopup.promptpay_account.replace(/[-\s]/g, "").trim();
    const expectedBankAccount = accountTopup.bank_account?.replace(/[-\s]/g, "").trim();

    let isReceiverMatched = false;
    let receiverInfo = "";

    if (data.receiver?.proxy?.value) {
        const actualPhone = data.receiver.proxy.value.replace(/[-\s]/g, "").trim();
        receiverInfo = actualPhone;

        if (expectedPhone && actualPhone.slice(-4) === expectedPhone.slice(-4)) {
            isReceiverMatched = true;
        }
    } else if (data.receiver?.account?.value) {
        const actualAccount = data.receiver.account.value.replace(/[-\s]/g, "").trim();
        receiverInfo = actualAccount;

        if (expectedBankAccount && actualAccount.slice(-4) === expectedBankAccount.slice(-4)) {
            isReceiverMatched = true;
        }
    } else {
        isReceiverMatched = true;
        receiverInfo = "ไม่สามารถตรวจสอบได้";
    }

    if (!isReceiverMatched && data.receiver?.proxy?.value) {
        return {
            success: false,
            message: `❌ ผู้รับไม่ตรงกัน: คาดว่า "${expectedPhone || expectedBankAccount}" แต่ได้ "${receiverInfo}"`,
        };
    }

    await prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
            data: {
                userId: user.id,
                amount: amount,
                type: "TOPUP",
            },
        });

        await tx.topupRequest.create({
            data: {
                userId: user.id,
                amount: amount,
                code: code,
                accountTopupId: accountTopup.id,
                transactionId: transaction.id,
            },
        });

        await tx.user.update({
            where: { id: user.id },
            data: {
                credit: {
                    increment: amount,
                },
            },
        });
    });

    return {
        message: `✅ ยืนยันการชำระเงินสำเร็จ จำนวน ${amount} บาท`,
    };
};

const isCodeExist = async (code: string) => {
    const existing = await prisma.topupRequest.findUnique({
        where: { code: code },
    });

    return existing ? true : false;
};
