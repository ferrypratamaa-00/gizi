import { loginSchema } from "@repo/schema"
import { useForm } from "@tanstack/react-form"

export const useLoginForm = () => {
    const form = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        validators: {
            onChange: loginSchema
        },
        onSubmit: async ({ value }) => {
            console.log(value)
        }
    })

    return { form }
}