import { appEnv } from '@/shared/utils/appEnv'

export const SplashScreen = () => {
    return (
        <div className="h-screen flex items-center justify-center flex-col gap-2 splash">
            <img src="https://picsum.dev/256/256" alt="Splash Screen" className="w-16 h-16 rounded-full border border-primary p-1 icon" />
            <div className="flex flex-col items-center title">
                <p className="text-xl font-bold text-primary">{appEnv.APP_NAME}</p>
                <p className="text-sm text-gray-500">Pantau Gizi Anakmu</p>
            </div>
        </div>
    )
}