import { LoginForm } from "@/features/auth/ui/Login";
import { Logo } from "@/shared/ui/components/Logo";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/login/")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <div className="relative flex h-screen flex-col items-center bg-white">
            {/* Header / Background */}
            <div className="relative flex h-[35vh] min-h-[220px] w-full items-end justify-center bg-primary rounded-b-[100%]">
                <Logo
                    src="https://picsum.dev/256/256"
                    alt="Logo"
                    className="mb-[-40px] h-20 w-20"
                />
            </div>

            {/* Form */}
            <div className="mt-16 w-full max-w-sm px-4">
                <LoginForm />
            </div>
        </div>
    );
}
