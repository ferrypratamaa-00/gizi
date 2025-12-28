import { z } from "zod";

export const loginSchema = z.object({
    tenantId: z.string().min(6, "Tenant ID setidaknya 6 karakter"),
    password: z.string().min(8, "Password setidaknya 8 karakter"),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export interface LoginResponse {
    token: string;
    user: {
        tenantId: string;
        name: string;
    };
}

export const requestOtpSchema = z.object({
    phoneNumber: z.string().min(10),
});

export const verifyOtpSchema = z.object({
    phoneNumber: z.string().min(10),
    otp: z.string().length(6),
});

export type requestOtpPayload = z.infer<typeof requestOtpSchema>;

export type verifyOtpPayload = z.infer<typeof verifyOtpSchema>;
