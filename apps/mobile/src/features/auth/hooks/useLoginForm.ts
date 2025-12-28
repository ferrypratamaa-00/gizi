import { requestOtpSchema } from "@repo/schema";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";

export const useLoginForm = () => {
    const navigate = useNavigate();
    const form = useForm({
        defaultValues: {
            phoneNumber: "",
        },
        validators: {
            onChange: requestOtpSchema,
        },
        onSubmit: async ({ value }) => {
            console.log(value);
            navigate({
                to: "/login/$phoneNumber/otp",
                params: { phoneNumber: value.phoneNumber },
            });
        },
    });

    return { form };
};
