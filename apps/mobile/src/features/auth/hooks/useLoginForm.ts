import { requestOtpSchema } from "@repo/schema";
import { useForm } from "@tanstack/react-form";

export const useLoginForm = () => {
    const form = useForm({
        defaultValues: {
            phoneNumber: "",
        },
        validators: {
            onChange: requestOtpSchema,
        },
        onSubmit: async ({ value }) => {
            console.log(value);
        },
    });

    return { form };
};
