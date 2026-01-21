import z from "zod";

export const createDeckSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    love: z.number().min(0).max(100).default(50),
    life: z.number().min(0).max(100).default(50),
    finance: z.number().min(0).max(100).default(50),
    career: z.number().min(0).max(100).default(50),
    type: z.enum(["TARO", "LENORMAND", "POKER"]),
    cards: z.array(
        z.object({
            name: z.string().min(1),
            nickName: z.string().min(1),
            media: z.instanceof(File),
            description: z.string().min(1),
        }),
    ),
});

export type CreateDeckSchema = z.infer<typeof createDeckSchema>;

export const updateDeckSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    description: z.string().min(1),
    love: z.number().min(0).max(100).default(50),
    life: z.number().min(0).max(100).default(50),
    finance: z.number().min(0).max(100).default(50),
    career: z.number().min(0).max(100).default(50),
    cards: z.array(
        z.object({
            id: z.string().min(1),
            name: z.string().optional(),
            nickName: z.string().optional(),
            media: z.instanceof(File).optional(),
            description: z.string().optional(),
        }),
    ),
});

export type UpdateDeckSchema = z.infer<typeof updateDeckSchema>;
