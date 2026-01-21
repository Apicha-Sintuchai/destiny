import { z } from "zod";

export const mediaSchema = z.object({
    media: z.instanceof(File),
})

export const updateFortuneTellerSchma = z.object({
    name: z.string().min(1),
    character: z.string().min(1),
    love: z.number().min(0).max(100).default(50),
    life: z.number().min(0).max(100).default(50),
    finance: z.number().min(0).max(100).default(50),
    career: z.number().min(0).max(100).default(50),
})

export const createFortuneTellerSchema = updateFortuneTellerSchma.extend(mediaSchema.shape)
