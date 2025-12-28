import { verifyOtpSchema } from "@repo/schema";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";

interface UseOTPVerificationProps {
    phoneNumber: string;
}

export const useOTPVerification = ({
    phoneNumber,
}: UseOTPVerificationProps) => {
    const navigate = useNavigate();
    const form = useForm({
        defaultValues: {
            phoneNumber: phoneNumber,
            otp: "",
        },
        validators: {
            onChange: verifyOtpSchema,
        },
        onSubmit: async ({ value }) => {
            console.log("Verifying OTP:", value);
            // Simulate verification success
            setTimeout(() => {
                navigate({ to: "/" });
            }, 1000);
        },
    });

    return { form };
};
