import { appEnv } from "@/shared/utils/appEnv";
import "../styles/styles.css";

export const SplashScreen = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center flex-col gap-2 overflow-hidden">
            <img
                src="https://picsum.dev/256/256"
                alt="Splash Screen"
                className="w-16 h-16 p-1 border border-gray-300 rounded-full iconSplash"
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
