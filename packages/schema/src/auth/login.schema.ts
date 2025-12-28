import { z } from 'zod'

export const loginSchema = z.object({
    tenantId: z.string().min(6, 'Tenant ID must be at least 6 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginPayload = z.infer<typeof loginSchema>

export interface LoginResponse {
    token: string
    user: {
        tenantId: string
        name: string
    }
}
