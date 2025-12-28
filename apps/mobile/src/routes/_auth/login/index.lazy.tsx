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

            {/* Content Container */}
            <div className="mt-12 w-full max-w-sm px-6 flex flex-col gap-6">
                {/* Welcome Text */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Selamat Datang!
                    </h1>
                    <p className="text-sm text-gray-500">
                        Silahkan masuk untuk melanjutkan perjalanan sehatmu.
                    </p>
                </div>

                {/* Form */}
                <LoginForm />
            </div>

            {/* Footer Terms */}
            <div className="mt-auto mb-8 text-center px-8">
                <p className="text-xs text-gray-400 leading-relaxed">
                    Dengan masuk, Anda menyetujui <br />
                    <span className="underline cursor-pointer">
                        Syarat & Ketentuan
                    </span>{" "}
                    serta{" "}
                    <span className="underline cursor-pointer">
                        Kebijakan Privasi
                    </span>{" "}
                    kami.
                </p>
            </div>
        </div>
    );
}
