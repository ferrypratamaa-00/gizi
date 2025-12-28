import { createLazyFileRoute } from "@tanstack/react-router";
import { OTPVerificationForm } from "@/features/auth/ui/OTPVerificationForm";

export const Route = createLazyFileRoute("/_auth/login/$phoneNumber/otp")({
    component: RouteComponent,
});

function RouteComponent() {
    const { phoneNumber } = Route.useParams();
    return (
        <div className="flex h-screen flex-col items-center justify-center px-6 bg-white">
            <OTPVerificationForm phoneNumber={phoneNumber} />
        </div>
    );
}
