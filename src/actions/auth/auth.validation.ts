import { z } from "zod";

export const loginSchema = z.object({
    phoneNumber: z.string().regex(/((\+66|0)(\d{1,2}\-?\d{3}\-?\d{3,4}))|((\+๖๖|๐)([๐-๙]{1,2}\-?[๐-๙]{3}\-?[๐-๙]{3,4}))/, "หมายเลขโทรศัพท์ไม่ถูกต้อง"),
    password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export const registerSchema = z.object({
    firstname: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
    lastname: z.string().min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร"),
    phoneNumber: z.string().regex(/((\+66|0)(\d{1,2}\-?\d{3}\-?\d{3,4}))|((\+๖๖|๐)([๐-๙]{1,2}\-?[๐-๙]{3}\-?[๐-๙]{3,4}))/, "หมายเลขโทรศัพท์ไม่ถูกต้อง"),
    password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    birthday: z.date()
});

export const signUpSchema = registerSchema
    .extend({
        confirm_password: z.string().min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    })
    .refine((data) => data.password === data.confirm_password, {
        path: ["confirm_password"],
        message: "รหัสผ่านไม่ตรงกัน",
    });
