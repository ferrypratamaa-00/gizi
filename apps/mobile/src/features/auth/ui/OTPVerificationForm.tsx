import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
    Button,
} from "@repo/ui/components";
import { useOTPVerification } from "../hooks/useOTPVerification"; // Adjust path if needed
import { ArrowRight } from "lucide-react";

interface OTPVerificationFormProps {
    phoneNumber: string;
}

export const OTPVerificationForm = ({
    phoneNumber,
}: OTPVerificationFormProps) => {
    const { form } = useOTPVerification({ phoneNumber });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col gap-8 w-full items-center"
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight">
                    Verifikasi
                </h2>
                <p className="text-sm text-gray-500">
                    Masukkan kode 6-digit yang kami kirim ke <br />
                    <span className="font-semibold text-gray-900">
                        {phoneNumber}
                    </span>
                </p>
            </div>

            <form.Field
                name="otp"
                children={(field) => (
                    <div className="flex flex-col items-center gap-2">
                        <InputOTP
                            maxLength={6}
                            value={field.state.value}
                            onChange={(value) => field.handleChange(value)}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        {field.state.meta.errors ? (
                            <p className="text-xs text-destructive mt-2">
                                {field.state.meta.errors.join(", ")}
                            </p>
                        ) : null}
                    </div>
                )}
            />

            <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                    <Button
                        type="submit"
                        disabled={!canSubmit}
                        className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base rounded-xl"
                    >
                        {isSubmitting ? "Memverifikasi..." : "Verifikasi"}
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                )}
            />

            <div className="text-sm text-gray-500">
                Tidak menerima kode?{" "}
                <span className="text-primary font-semibold cursor-pointer">
                    Kirim Ulang
                </span>
            </div>
        </form>
    );
};
