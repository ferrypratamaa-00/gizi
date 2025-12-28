import { appEnv } from "@/shared/utils/appEnv";
import "../styles/styles.css";
import { Logo } from "@/shared/ui/components/Logo";

export const SplashScreen = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center flex-col gap-2 overflow-hidden">
            <Logo
                src="https://picsum.dev/256/256"
                alt="Splash Screen"
                className="i"
            />
            <div className="flex flex-col items-center titleSplash">
                <p className="text-xl font-bold text-primary">
                    {appEnv.APP_NAME}
                </p>
                <p className="text-sm text-gray-500">Pantau Gizi Anakmu</p>
            </div>
        </div>
    );
};
