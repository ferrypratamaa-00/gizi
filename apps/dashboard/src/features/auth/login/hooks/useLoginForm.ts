import { loginSchema, type LoginPayload } from "@repo/schema"
import { useForm } from "@tanstack/react-form"

export const useLoginForm = () => {
    const form = useForm<LoginPayload>({
        defaultValues: {
            email: '',
            password: ''
        },
        validatorAdapter: zodValidator(),
        validators: {
            onChange: loginSchema
        },
        onSubmit: async ({ values }) => {
            console.log(values)
        }
    })

    return form
}