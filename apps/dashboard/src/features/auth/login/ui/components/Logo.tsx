import { appEnv } from "@/shared/utils/appEnv"

export const Logo = () => {
    return (
        <div className='flex items-center gap-2'>
            <div className='h-10 w-10 rounded-lg bg-[#11403e] flex items-center justify-center text-white font-bold text-xl'>
              G
            </div>
            <span className='text-xl font-bold text-[#11403e]'>{appEnv.APP_NAME}</span>
        </div>
    )
}